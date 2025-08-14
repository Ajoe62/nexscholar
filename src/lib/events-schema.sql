-- Events system database schema for NexScholar
-- Run this script in your Supabase SQL editor

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  event_type TEXT CHECK (event_type IN ('webinar', 'workshop', 'conference', 'seminar', 'networking', 'info_session')) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  location TEXT, -- Physical location or 'Online'
  meeting_link TEXT, -- For virtual events
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  is_free BOOLEAN DEFAULT true,
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  organizer_name TEXT NOT NULL,
  organizer_email TEXT,
  organizer_bio TEXT,
  organizer_avatar TEXT,
  requirements TEXT[] DEFAULT '{}',
  what_you_learn TEXT[] DEFAULT '{}',
  target_audience TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  attendance_status TEXT CHECK (attendance_status IN ('registered', 'attended', 'no_show')) DEFAULT 'registered',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  notes TEXT,
  UNIQUE(event_id, user_id)
);

-- Event feedback table
CREATE TABLE IF NOT EXISTS event_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(event_id, user_id)
);

-- Event resources table (for materials, recordings, etc.)
CREATE TABLE IF NOT EXISTS event_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT CHECK (resource_type IN ('slide', 'recording', 'document', 'link', 'certificate')) NOT NULL,
  file_url TEXT,
  external_link TEXT,
  is_public BOOLEAN DEFAULT false, -- Only registered users can access if false
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events (public read, creators can edit)
CREATE POLICY "Everyone can read published events" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for event registrations
CREATE POLICY "Users can view their own registrations" ON event_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" ON event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Event creators can view registrations for their events" ON event_registrations
  FOR SELECT USING (
    auth.uid() IN (
      SELECT created_by FROM events WHERE id = event_id
    )
  );

-- RLS Policies for event feedback
CREATE POLICY "Users can view feedback for events they registered for" ON event_feedback
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT created_by FROM events WHERE id = event_id
    )
  );

CREATE POLICY "Users can create feedback for events they attended" ON event_feedback
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    auth.uid() IN (
      SELECT user_id FROM event_registrations 
      WHERE event_id = event_feedback.event_id
    )
  );

CREATE POLICY "Users can update their own feedback" ON event_feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for event resources
CREATE POLICY "Everyone can view public resources" ON event_resources
  FOR SELECT USING (is_public = true);

CREATE POLICY "Registered users can view private resources" ON event_resources
  FOR SELECT USING (
    is_public = false AND
    auth.uid() IN (
      SELECT user_id FROM event_registrations 
      WHERE event_id = event_resources.event_id
    )
  );

CREATE POLICY "Event creators can manage resources" ON event_resources
  FOR ALL USING (
    auth.uid() IN (
      SELECT created_by FROM events WHERE id = event_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_feedback_event_id ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_event_resources_event_id ON event_resources(event_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update attendee count
CREATE OR REPLACE FUNCTION update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events 
    SET current_attendees = current_attendees + 1 
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events 
    SET current_attendees = current_attendees - 1 
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update attendee count
DROP TRIGGER IF EXISTS update_attendee_count_trigger ON event_registrations;
CREATE TRIGGER update_attendee_count_trigger
  AFTER INSERT OR DELETE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count();

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for event images bucket
CREATE POLICY "Anyone can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images' AND
    auth.role() = 'authenticated'
  );

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Events system database schema has been successfully created!';
    RAISE NOTICE 'Created 4 tables: events, event_registrations, event_feedback, event_resources';
    RAISE NOTICE 'Enabled Row Level Security with proper policies';
    RAISE NOTICE 'Created storage bucket for event images';
    RAISE NOTICE 'You can now start using the events system!';
END $$;
