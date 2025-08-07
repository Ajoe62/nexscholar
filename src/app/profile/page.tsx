"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, auth } from "@/lib/supabase";
import {
  UserIcon,
  MailIcon,
  GlobeIcon,
  CalendarIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  CameraIcon,
  GraduationCap,
  BriefcaseIcon,
} from "lucide-react";

interface UserProfile {
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
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    bio: "",
    university: "",
    field_of_study: "",
    graduation_year: "",
    linkedin_url: "",
    github_url: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, mounted, router]);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await auth.getUserProfile(user.id);

      if (error && error.code === "PGRST116") {
        // Profile doesn't exist, create one with basic info
        const userMetadata = user.user_metadata || {};
        const newProfile = {
          full_name: userMetadata.full_name || user.email?.split("@")[0] || "",
          role: userMetadata.role || "student",
          country: userMetadata.country || "",
          email: user.email || "",
        };

        const { data: createdProfile, error: createError } =
          await auth.createUserProfile(user.id, newProfile);
        if (createError) {
          console.error("Error creating profile:", createError);
        } else if (createdProfile) {
          setProfile(createdProfile);
          setEditForm({
            full_name: createdProfile.full_name,
            bio: createdProfile.bio || "",
            university: createdProfile.university || "",
            field_of_study: createdProfile.field_of_study || "",
            graduation_year: createdProfile.graduation_year?.toString() || "",
            linkedin_url: createdProfile.linkedin_url || "",
            github_url: createdProfile.github_url || "",
          });
        }
      } else if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfile(data);
        setEditForm({
          full_name: data.full_name,
          bio: data.bio || "",
          university: data.university || "",
          field_of_study: data.field_of_study || "",
          graduation_year: data.graduation_year?.toString() || "",
          linkedin_url: data.linkedin_url || "",
          github_url: data.github_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    try {
      const updateData = {
        ...editForm,
        graduation_year: editForm.graduation_year
          ? parseInt(editForm.graduation_year)
          : null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      } else {
        setProfile(data);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name,
        bio: profile.bio || "",
        university: profile.university || "",
        field_of_study: profile.field_of_study || "",
        graduation_year: profile.graduation_year?.toString() || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
      });
    }
    setIsEditing(false);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-32"></div>
            <div className="px-6 pb-6">
              <div className="flex items-end -mt-16 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <UserIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transition-colors">
                    <CameraIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {profile.full_name}
                      </h1>
                      <div className="flex items-center mt-1 text-gray-600">
                        <span className="capitalize inline-flex items-center">
                          {profile.role === "student" ? (
                            <GraduationCap className="w-4 h-4 mr-1" />
                          ) : (
                            <BriefcaseIcon className="w-4 h-4 mr-1" />
                          )}
                          {profile.role}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <GlobeIcon className="w-4 h-4 mr-1" />
                          {profile.country}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        isEditing ? handleCancel() : setIsEditing(true)
                      }
                      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      {isEditing ? (
                        <>
                          <XIcon className="w-4 h-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <EditIcon className="w-4 h-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              full_name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <p className="text-gray-900 flex items-center">
                        <MailIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bio: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-700">
                        {profile.bio || "No bio added yet."}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Academic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.university}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            university: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Your university or institution"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.university || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field of Study
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.field_of_study}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              field_of_study: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g., Computer Science"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profile.field_of_study || "Not specified"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Graduation Year
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.graduation_year}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              graduation_year: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="2024"
                          min="1990"
                          max="2030"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {profile.graduation_year || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Social Links
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editForm.linkedin_url}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            linkedin_url: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.linkedin_url ? (
                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 underline"
                          >
                            {profile.linkedin_url}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={editForm.github_url}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            github_url: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://github.com/yourusername"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {profile.github_url ? (
                          <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 underline"
                          >
                            {profile.github_url}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(profile.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="text-gray-900 font-medium">
                      {Math.round(
                        (((profile.bio ? 1 : 0) +
                          (profile.university ? 1 : 0) +
                          (profile.field_of_study ? 1 : 0) +
                          (profile.graduation_year ? 1 : 0)) /
                          4) *
                          100
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    View Dashboard
                  </button>
                  <button
                    onClick={() => router.push("/scholarships")}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Browse Scholarships
                  </button>
                  <button
                    onClick={() => router.push("/mentors")}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Find Mentors
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
