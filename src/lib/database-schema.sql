-- Database schema for NexScholar application
-- Run this script in your Supabase SQL editor

-- Note: Supabase manages JWT secrets automatically, so no need to set them manually

-- Users table (should already exist via Supabase Auth)
-- This is just for reference, Supabase Auth creates this automatically
/*
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'mentor')) DEFAULT 'student',
  country TEXT NOT NULL,
  bio TEXT,
  university TEXT,
  field_of_study TEXT,
  graduation_year INTEGER,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
*/

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  deadline DATE NOT NULL,
  eligibility_criteria TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  application_url TEXT,
  organization TEXT,
  country TEXT,
  field_of_study TEXT[] DEFAULT '{}',
  level_of_study TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('active', 'inactive', 'expired')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected')) DEFAULT 'draft',
  application_data JSONB DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Saved scholarships table
CREATE TABLE IF NOT EXISTS saved_scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, scholarship_id)
);

-- Consultation bookings table
CREATE TABLE IF NOT EXISTS consultation_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_name TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  meeting_link TEXT,
  documents JSONB,
  notes TEXT,
  fee NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  file_url TEXT NOT NULL,
  notes TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scholarships (public read, admin write)
CREATE POLICY "Everyone can read scholarships" ON scholarships
  FOR SELECT USING (true);

-- RLS Policies for applications (users can only see their own)
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" ON applications
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for saved scholarships (users can only see their own)
CREATE POLICY "Users can view their own saved scholarships" ON saved_scholarships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved scholarships" ON saved_scholarships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved scholarships" ON saved_scholarships
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for consultation bookings (users can only see their own)
CREATE POLICY "Users can view their own consultation bookings" ON consultation_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultation bookings" ON consultation_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultation bookings" ON consultation_bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consultation bookings" ON consultation_bookings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for documents (users can only see their own)
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Sample scholarship data
INSERT INTO scholarships (title, description, amount, currency, deadline, eligibility_criteria, requirements, application_url, organization, country, field_of_study, level_of_study) VALUES
('Fulbright Foreign Student Program', 'The Fulbright Foreign Student Program enables graduate students, young professionals and artists from abroad to study and conduct research in the United States.', 25000, 'USD', '2025-10-15', ARRAY['Must be a citizen of a country other than the United States', 'Hold a bachelor''s degree or equivalent', 'Demonstrate English proficiency', 'Show leadership potential'], ARRAY['Completed application form', 'Personal statement', 'Academic transcripts', 'Letters of recommendation', 'English proficiency test scores'], 'https://www.fulbrightonline.org/', 'U.S. Department of State', 'United States', ARRAY['Any field'], ARRAY['Master''s', 'Doctoral']),

('Rhodes Scholarship', 'The Rhodes Scholarship is the oldest and most celebrated international fellowship award in the world. It provides all expenses for up to four years of study at the University of Oxford.', 70000, 'USD', '2025-10-01', ARRAY['Must be a citizen of an eligible country', 'Age 18-24 for most countries', 'Completed undergraduate degree', 'Demonstrate academic excellence'], ARRAY['Online application', 'Personal statement', 'Academic transcripts', '5-8 letters of recommendation', 'Photograph'], 'https://www.rhodeshouse.ox.ac.uk/', 'Rhodes Trust', 'United Kingdom', ARRAY['Any field'], ARRAY['Master''s', 'Doctoral']),

('Chevening Scholarships', 'Chevening Scholarships are the UK government''s global scholarship programme, funded by the Foreign and Commonwealth Office and partner organisations.', 35000, 'GBP', '2025-11-02', ARRAY['Be a citizen of a Chevening-eligible country', 'Have an undergraduate degree', 'Have at least two years of work experience', 'Apply to three different eligible UK university courses'], ARRAY['Completed online application', 'Personal statement', 'Academic transcripts', 'Two references', 'English language requirement'], 'https://www.chevening.org/', 'UK Government', 'United Kingdom', ARRAY['Any field'], ARRAY['Master''s']),

('DAAD Scholarships', 'The German Academic Exchange Service (DAAD) offers scholarships to international students and researchers for study and research stays in Germany.', 20000, 'EUR', '2025-12-01', ARRAY['Academic excellence', 'Must have completed studies not more than 6 years ago', 'Specific country eligibility'], ARRAY['Online application', 'Letter of motivation', 'CV', 'Academic transcripts', 'Letters of recommendation'], 'https://www.daad.org/', 'German Academic Exchange Service', 'Germany', ARRAY['Engineering', 'Sciences', 'Arts', 'Humanities'], ARRAY['Master''s', 'Doctoral']),

('Australia Awards Scholarships', 'Australia Awards Scholarships are long-term development awards administered by the Department of Foreign Affairs and Trade.', 30000, 'AUD', '2025-05-30', ARRAY['Be a citizen of an eligible developing country', 'Meet health and character requirements', 'Satisfy English language requirements', 'Have completed a bachelor degree or equivalent'], ARRAY['Online application', 'Academic transcripts', 'English proficiency test results', 'Two referees', 'Employment history'], 'https://www.australiaawards.gov.au/', 'Australian Government', 'Australia', ARRAY['Development-related fields', 'Public Policy', 'Health', 'Education'], ARRAY['Master''s', 'Doctoral']);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_country ON scholarships(country);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_scholarship_id ON applications(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user_id ON saved_scholarships(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_user_id ON consultation_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_scheduled_at ON consultation_bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- Update function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
