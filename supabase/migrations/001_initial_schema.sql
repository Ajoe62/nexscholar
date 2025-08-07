-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('student', 'mentor')) DEFAULT 'student',
    country TEXT,
    bio TEXT,
    university TEXT,
    field_of_study TEXT,
    graduation_year INTEGER,
    linkedin_url TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create scholarships table
CREATE TABLE scholarships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(12,2),
    currency TEXT DEFAULT 'USD',
    deadline DATE,
    eligibility_criteria TEXT[],
    requirements TEXT[],
    application_url TEXT,
    organization TEXT,
    country TEXT,
    field_of_study TEXT[],
    level_of_study TEXT[], -- undergraduate, graduate, postgraduate, etc.
    status TEXT CHECK (status IN ('active', 'inactive', 'expired')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected')) DEFAULT 'draft',
    application_data JSONB, -- Store form data, documents, etc.
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, scholarship_id)
);

-- Create saved_scholarships table (user bookmarks)
CREATE TABLE saved_scholarships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, scholarship_id)
);

-- Create mentorship_sessions table
CREATE TABLE mentorship_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mentee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultation_bookings table
CREATE TABLE consultation_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consultant_name TEXT NOT NULL,
    consultation_type TEXT NOT NULL, -- document_review, application_assistance, etc.
    scheduled_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 30,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    meeting_link TEXT,
    documents JSONB, -- Store uploaded document references
    notes TEXT,
    fee DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Scholarships are publicly readable
CREATE POLICY "Scholarships are publicly readable" ON scholarships
    FOR SELECT USING (true);

-- Applications are private to the user
CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications" ON applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON applications
    FOR DELETE USING (auth.uid() = user_id);

-- Saved scholarships are private to the user
CREATE POLICY "Users can view own saved scholarships" ON saved_scholarships
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save scholarships" ON saved_scholarships
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave scholarships" ON saved_scholarships
    FOR DELETE USING (auth.uid() = user_id);

-- Mentorship sessions - users can see sessions they're involved in
CREATE POLICY "Users can view own mentorship sessions" ON mentorship_sessions
    FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Mentors can create sessions" ON mentorship_sessions
    FOR INSERT WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Participants can update sessions" ON mentorship_sessions
    FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Consultation bookings are private to the user
CREATE POLICY "Users can view own consultation bookings" ON consultation_bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create consultation bookings" ON consultation_bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consultation bookings" ON consultation_bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_country ON users(country);
CREATE INDEX idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX idx_scholarships_country ON scholarships(country);
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_saved_scholarships_user_id ON saved_scholarships(user_id);
CREATE INDEX idx_mentorship_sessions_mentor_id ON mentorship_sessions(mentor_id);
CREATE INDEX idx_mentorship_sessions_mentee_id ON mentorship_sessions(mentee_id);
CREATE INDEX idx_consultation_bookings_user_id ON consultation_bookings(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_scholarships
    BEFORE UPDATE ON scholarships
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_applications
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_mentorship_sessions
    BEFORE UPDATE ON mentorship_sessions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_consultation_bookings
    BEFORE UPDATE ON consultation_bookings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
