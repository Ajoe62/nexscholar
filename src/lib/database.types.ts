export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "student" | "mentor";
          country: string;
          bio: string | null;
          university: string | null;
          field_of_study: string | null;
          graduation_year: number | null;
          linkedin_url: string | null;
          github_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: "student" | "mentor";
          country: string;
          bio?: string | null;
          university?: string | null;
          field_of_study?: string | null;
          graduation_year?: number | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: "student" | "mentor";
          country?: string;
          bio?: string | null;
          university?: string | null;
          field_of_study?: string | null;
          graduation_year?: number | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      scholarships: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          amount: number;
          currency: string;
          deadline: string;
          eligibility_criteria: string[];
          requirements: string[];
          application_url: string | null;
          organization: string | null;
          country: string | null;
          field_of_study: string[];
          level_of_study: string[];
          status: "active" | "inactive" | "expired";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          amount: number;
          currency?: string;
          deadline: string;
          eligibility_criteria: string[];
          requirements: string[];
          application_url?: string | null;
          organization?: string | null;
          country?: string | null;
          field_of_study: string[];
          level_of_study: string[];
          status?: "active" | "inactive" | "expired";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          amount?: number;
          currency?: string;
          deadline?: string;
          eligibility_criteria?: string[];
          requirements?: string[];
          application_url?: string | null;
          organization?: string | null;
          country?: string | null;
          field_of_study?: string[];
          level_of_study?: string[];
          status?: "active" | "inactive" | "expired";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          scholarship_id: string;
          status:
            | "draft"
            | "submitted"
            | "under_review"
            | "accepted"
            | "rejected";
          application_data: Json;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scholarship_id: string;
          status?:
            | "draft"
            | "submitted"
            | "under_review"
            | "accepted"
            | "rejected";
          application_data?: Json;
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scholarship_id?: string;
          status?:
            | "draft"
            | "submitted"
            | "under_review"
            | "accepted"
            | "rejected";
          application_data?: Json;
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_scholarship_id_fkey";
            columns: ["scholarship_id"];
            isOneToOne: false;
            referencedRelation: "scholarships";
            referencedColumns: ["id"];
          }
        ];
      };
      saved_scholarships: {
        Row: {
          id: string;
          user_id: string;
          scholarship_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scholarship_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scholarship_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_scholarships_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_scholarships_scholarship_id_fkey";
            columns: ["scholarship_id"];
            isOneToOne: false;
            referencedRelation: "scholarships";
            referencedColumns: ["id"];
          }
        ];
      };
      consultation_bookings: {
        Row: {
          id: string;
          user_id: string;
          consultant_name: string;
          consultation_type: string;
          scheduled_at: string;
          duration_minutes: number;
          status: "pending" | "confirmed" | "completed" | "cancelled";
          meeting_link: string | null;
          documents: Json | null;
          notes: string | null;
          fee: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          consultant_name: string;
          consultation_type: string;
          scheduled_at: string;
          duration_minutes: number;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          meeting_link?: string | null;
          documents?: Json | null;
          notes?: string | null;
          fee: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          consultant_name?: string;
          consultation_type?: string;
          scheduled_at?: string;
          duration_minutes?: number;
          status?: "pending" | "confirmed" | "completed" | "cancelled";
          meeting_link?: string | null;
          documents?: Json | null;
          notes?: string | null;
          fee?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "consultation_bookings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          original_filename: string;
          file_type: string;
          file_size: number;
          category: string;
          description: string | null;
          status: "pending" | "approved" | "rejected";
          upload_date: string;
          file_url: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          filename: string;
          original_filename: string;
          file_type: string;
          file_size: number;
          category: string;
          description?: string | null;
          status?: "pending" | "approved" | "rejected";
          upload_date?: string;
          file_url: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          original_filename?: string;
          file_type?: string;
          file_size?: number;
          category?: string;
          description?: string | null;
          status?: "pending" | "approved" | "rejected";
          upload_date?: string;
          file_url?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
