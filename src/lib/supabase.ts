import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check for placeholder values or missing values
const isPlaceholder =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("your_project_url_here") ||
  supabaseUrl.includes("your_supabase_url_here") ||
  supabaseAnonKey.includes("your_anon_key_here");

let finalUrl = supabaseUrl;
let finalKey = supabaseAnonKey;

if (isPlaceholder) {
  // Use dummy values for build/static generation
  finalUrl = "https://placeholder.supabase.co";
  finalKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM1MDk2MDAsImV4cCI6MjAwOTA4NTYwMH0.placeholder";

  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.warn(
      "⚠️  Supabase not configured. Please update your .env.local file with actual Supabase credentials."
    );
  }
}

export const supabase = createClient<Database>(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper functions for authentication and user management
export const auth = {
  // Get current user
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Create or update user profile
  createUserProfile: async (
    userId: string,
    userData: {
      full_name: string;
      role: "student" | "mentor";
      country: string;
      email: string;
    }
  ) => {
    const { data, error } = await supabase
      .from("users")
      .upsert({
        id: userId,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        country: userData.country,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    return { data, error };
  },
};

// Legacy functions for backward compatibility
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !isPlaceholder;
};
