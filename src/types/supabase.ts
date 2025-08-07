export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "student" | "mentor" | "admin";
          country: string | null;
          phone: string | null;
          date_of_birth: string | null;
          field_of_study: string | null;
          education_level:
            | "undergraduate"
            | "masters"
            | "phd"
            | "postdoc"
            | null;
          profile_picture_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "student" | "mentor" | "admin";
          country?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          field_of_study?: string | null;
          education_level?:
            | "undergraduate"
            | "masters"
            | "phd"
            | "postdoc"
            | null;
          profile_picture_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "student" | "mentor" | "admin";
          country?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          field_of_study?: string | null;
          education_level?:
            | "undergraduate"
            | "masters"
            | "phd"
            | "postdoc"
            | null;
          profile_picture_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      mentors: {
        Row: {
          id: string;
          user_id: string | null;
          expertise: string[];
          experience_years: number | null;
          education_background: string | null;
          current_position: string | null;
          hourly_rate: number | null;
          availability_schedule: Json | null;
          bio: string | null;
          languages: string[] | null;
          total_consultations: number;
          average_rating: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          expertise: string[];
          experience_years?: number | null;
          education_background?: string | null;
          current_position?: string | null;
          hourly_rate?: number | null;
          availability_schedule?: Json | null;
          bio?: string | null;
          languages?: string[] | null;
          total_consultations?: number;
          average_rating?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          expertise?: string[];
          experience_years?: number | null;
          education_background?: string | null;
          current_position?: string | null;
          hourly_rate?: number | null;
          availability_schedule?: Json | null;
          bio?: string | null;
          languages?: string[] | null;
          total_consultations?: number;
          average_rating?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      scholarships: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          university: string;
          country: string;
          degree_level: "undergraduate" | "masters" | "phd" | "postdoc";
          field_of_study: string[] | null;
          funding_type:
            | "full_funding"
            | "partial_funding"
            | "tuition_only"
            | "stipend_only";
          amount: number | null;
          currency: string | null;
          deadline: string;
          eligibility_criteria: string | null;
          application_requirements: string[] | null;
          application_url: string | null;
          contact_email: string | null;
          logo_url: string | null;
          is_active: boolean;
          views_count: number;
          applications_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          university: string;
          country: string;
          degree_level: "undergraduate" | "masters" | "phd" | "postdoc";
          field_of_study?: string[] | null;
          funding_type:
            | "full_funding"
            | "partial_funding"
            | "tuition_only"
            | "stipend_only";
          amount?: number | null;
          currency?: string | null;
          deadline: string;
          eligibility_criteria?: string | null;
          application_requirements?: string[] | null;
          application_url?: string | null;
          contact_email?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          views_count?: number;
          applications_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          university?: string;
          country?: string;
          degree_level?: "undergraduate" | "masters" | "phd" | "postdoc";
          field_of_study?: string[] | null;
          funding_type?:
            | "full_funding"
            | "partial_funding"
            | "tuition_only"
            | "stipend_only";
          amount?: number | null;
          currency?: string | null;
          deadline?: string;
          eligibility_criteria?: string | null;
          application_requirements?: string[] | null;
          application_url?: string | null;
          contact_email?: string | null;
          logo_url?: string | null;
          is_active?: boolean;
          views_count?: number;
          applications_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      consultations: {
        Row: {
          id: string;
          student_id: string | null;
          mentor_id: string | null;
          title: string;
          description: string | null;
          consultation_type: string | null;
          scheduled_date: string;
          duration_minutes: number | null;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          meeting_url: string | null;
          notes: string | null;
          rating: number | null;
          feedback: string | null;
          price: number | null;
          payment_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          mentor_id?: string | null;
          title: string;
          description?: string | null;
          consultation_type?: string | null;
          scheduled_date: string;
          duration_minutes?: number | null;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          meeting_url?: string | null;
          notes?: string | null;
          rating?: number | null;
          feedback?: string | null;
          price?: number | null;
          payment_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          mentor_id?: string | null;
          title?: string;
          description?: string | null;
          consultation_type?: string | null;
          scheduled_date?: string;
          duration_minutes?: number | null;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          meeting_url?: string | null;
          notes?: string | null;
          rating?: number | null;
          feedback?: string | null;
          price?: number | null;
          payment_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          document_type:
            | "sop"
            | "cv"
            | "cover_letter"
            | "recommendation"
            | "other";
          original_file_url: string | null;
          reviewed_file_url: string | null;
          status: "submitted" | "in_review" | "completed" | "rejected";
          reviewer_id: string | null;
          submission_details: string | null;
          review_notes: string | null;
          deadline: string | null;
          price: number | null;
          payment_status: string | null;
          submitted_at: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          document_type:
            | "sop"
            | "cv"
            | "cover_letter"
            | "recommendation"
            | "other";
          original_file_url?: string | null;
          reviewed_file_url?: string | null;
          status?: "submitted" | "in_review" | "completed" | "rejected";
          reviewer_id?: string | null;
          submission_details?: string | null;
          review_notes?: string | null;
          deadline?: string | null;
          price?: number | null;
          payment_status?: string | null;
          submitted_at?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          document_type?:
            | "sop"
            | "cv"
            | "cover_letter"
            | "recommendation"
            | "other";
          original_file_url?: string | null;
          reviewed_file_url?: string | null;
          status?: "submitted" | "in_review" | "completed" | "rejected";
          reviewer_id?: string | null;
          submission_details?: string | null;
          review_notes?: string | null;
          deadline?: string | null;
          price?: number | null;
          payment_status?: string | null;
          submitted_at?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_scholarships: {
        Row: {
          id: string;
          user_id: string | null;
          scholarship_id: string | null;
          status: string | null;
          applied_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          scholarship_id?: string | null;
          status?: string | null;
          applied_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          scholarship_id?: string | null;
          status?: string | null;
          applied_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: string;
          related_id: string | null;
          read: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          message: string;
          type: string;
          related_id?: string | null;
          read?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: string;
          related_id?: string | null;
          read?: boolean | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      consultation_status: "pending" | "confirmed" | "completed" | "cancelled";
      degree_level: "undergraduate" | "masters" | "phd" | "postdoc";
      document_status: "submitted" | "in_review" | "completed" | "rejected";
      document_type: "sop" | "cv" | "cover_letter" | "recommendation" | "other";
      funding_type:
        | "full_funding"
        | "partial_funding"
        | "tuition_only"
        | "stipend_only";
      user_role: "student" | "mentor" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
