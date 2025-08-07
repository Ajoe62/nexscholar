-- Nexscholar Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'mentor', 'admin');
CREATE TYPE consultation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE document_status AS ENUM ('submitted', 'in_review', 'completed', 'rejected');
CREATE TYPE document_type AS ENUM ('sop', 'cv', 'cover_letter', 'recommendation', 'other');
CREATE TYPE funding_type AS ENUM ('full_funding', 'partial_funding', 'tuition_only', 'stipend_only');
CREATE TYPE degree_level AS ENUM ('undergraduate', 'masters', 'phd', 'postdoc');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'student',
    country TEXT,
    phone TEXT,
    date_of_birth DATE,
    field_of_study TEXT,
    education_level degree_level,
    profile_picture_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentors table
CREATE TABLE public.mentors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    expertise TEXT[] NOT NULL,
    experience_years INTEGER,
    education_background TEXT,
    current_position TEXT,
    hourly_rate DECIMAL(10,2),
    availability_schedule JSONB, -- Store weekly schedule
    bio TEXT,
    languages TEXT[],
    total_consultations INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarships table
CREATE TABLE public.scholarships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    university TEXT NOT NULL,
    country TEXT NOT NULL,
    degree_level degree_level NOT NULL,
    field_of_study TEXT[],
    funding_type funding_type NOT NULL,
    amount DECIMAL(12,2),
    currency TEXT DEFAULT 'USD',
    deadline DATE NOT NULL,
    eligibility_criteria TEXT,
    application_requirements TEXT[],
    application_url TEXT,
    contact_email TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User saved scholarships (bookmarks)
CREATE TABLE public.user_scholarships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'saved', -- saved, applied, accepted, rejected
    applied_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, scholarship_id)
);

-- Consultations table
CREATE TABLE public.consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.mentors(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    consultation_type TEXT, -- 'sop_review', 'visa_guidance', 'general_advice', etc.
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status consultation_status DEFAULT 'pending',
    meeting_url TEXT,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    price DECIMAL(10,2),
    payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type document_type NOT NULL,
    original_file_url TEXT,
    reviewed_file_url TEXT,
    status document_status DEFAULT 'submitted',
    reviewer_id UUID REFERENCES public.mentors(id),
    submission_details TEXT,
    review_notes TEXT,
    deadline DATE,
    price DECIMAL(10,2),
    payment_status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'consultation', 'document', 'scholarship', 'system'
    related_id UUID, -- ID of related consultation, document, etc.
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_scholarships_deadline ON public.scholarships(deadline);
CREATE INDEX idx_scholarships_country ON public.scholarships(country);
CREATE INDEX idx_scholarships_degree_level ON public.scholarships(degree_level);
CREATE INDEX idx_scholarships_funding_type ON public.scholarships(funding_type);
CREATE INDEX idx_consultations_student_id ON public.consultations(student_id);
CREATE INDEX idx_consultations_mentor_id ON public.consultations(mentor_id);
CREATE INDEX idx_consultations_scheduled_date ON public.consultations(scheduled_date);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_user_scholarships_user_id ON public.user_scholarships(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Mentors policies (public read, own update)
CREATE POLICY "Anyone can view active mentors" ON public.mentors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Mentors can update their own profile" ON public.mentors
    FOR UPDATE USING (user_id = auth.uid());

-- Scholarships policies (public read)
CREATE POLICY "Anyone can view active scholarships" ON public.scholarships
    FOR SELECT USING (is_active = true);

-- User scholarships policies
CREATE POLICY "Users can view their own saved scholarships" ON public.user_scholarships
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own saved scholarships" ON public.user_scholarships
    FOR ALL USING (user_id = auth.uid());

-- Consultations policies
CREATE POLICY "Users can view their own consultations" ON public.consultations
    FOR SELECT USING (
        student_id = auth.uid() OR 
        mentor_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid())
    );

CREATE POLICY "Students can create consultations" ON public.consultations
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update their own consultations" ON public.consultations
    FOR UPDATE USING (
        student_id = auth.uid() OR 
        mentor_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid())
    );

-- Documents policies
CREATE POLICY "Users can view their own documents" ON public.documents
    FOR SELECT USING (
        user_id = auth.uid() OR 
        reviewer_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create documents" ON public.documents
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own documents" ON public.documents
    FOR UPDATE USING (
        user_id = auth.uid() OR 
        reviewer_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid())
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON public.mentors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON public.scholarships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
