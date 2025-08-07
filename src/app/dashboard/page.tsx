"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, auth } from "@/lib/supabase";
import {
  BookmarkIcon,
  CalendarIcon,
  UserIcon,
  TrophyIcon,
  SearchIcon,
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  UsersIcon,
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
  created_at: string;
}

interface DashboardStats {
  totalScholarships: number;
  appliedScholarships: number;
  savedScholarships: number;
  upcomingDeadlines: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalScholarships: 156,
    appliedScholarships: 8,
    savedScholarships: 23,
    upcomingDeadlines: 3,
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
        // Profile doesn't exist, create one
        const userMetadata = user.user_metadata || {};
        const newProfile = {
          full_name: userMetadata.full_name || user.email?.split("@")[0] || "",
          role: userMetadata.role || "student",
          country: userMetadata.country || "",
          email: user.email || "",
        };

        const { data: createdProfile } = await auth.createUserProfile(
          user.id,
          newProfile
        );
        if (createdProfile) {
          setProfile(createdProfile);
        }
      } else if (data) {
        setProfile(data);
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

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const profileCompletion = Math.round(
    (((profile.bio ? 1 : 0) +
      (profile.university ? 1 : 0) +
      (profile.field_of_study ? 1 : 0) +
      (profile.graduation_year ? 1 : 0)) /
      4) *
      100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Welcome Section */}
        <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Welcome back, {profile.full_name}! 👋
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Ready to discover new scholarship opportunities?
              </p>

              {/* Quick Search */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search scholarships by field, country, or keyword..."
                    className="w-full px-6 py-4 pl-12 text-gray-900 bg-white rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
                  />
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile Completion Banner */}
            {profileCompletion < 100 && (
              <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserIcon className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-amber-800">
                        Complete Your Profile ({profileCompletion}%)
                      </h3>
                      <p className="text-amber-700">
                        A complete profile helps us recommend better
                        scholarships for you.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Complete Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrophyIcon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Scholarships
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalScholarships}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Applications
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.appliedScholarships}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookmarkIcon className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Saved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.savedScholarships}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Deadlines
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.upcomingDeadlines}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Quick Actions & Recent Activity */}
              <div className="lg:col-span-2 space-y-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/scholarships"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <SearchIcon className="w-8 h-8 text-primary-600 group-hover:text-primary-700" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Browse Scholarships
                        </h3>
                        <p className="text-sm text-gray-600">
                          Find new opportunities
                        </p>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-gray-400 ml-auto group-hover:text-primary-600" />
                    </Link>

                    <Link
                      href="/mentors"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <UsersIcon className="w-8 h-8 text-primary-600 group-hover:text-primary-700" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Find Mentors
                        </h3>
                        <p className="text-sm text-gray-600">
                          Get guidance from experts
                        </p>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-gray-400 ml-auto group-hover:text-primary-600" />
                    </Link>

                    <Link
                      href="/applications"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <BookOpenIcon className="w-8 h-8 text-primary-600 group-hover:text-primary-700" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          My Applications
                        </h3>
                        <p className="text-sm text-gray-600">
                          Track your progress
                        </p>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-gray-400 ml-auto group-hover:text-primary-600" />
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <UserIcon className="w-8 h-8 text-primary-600 group-hover:text-primary-700" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          Edit Profile
                        </h3>
                        <p className="text-sm text-gray-600">
                          Update your information
                        </p>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-gray-400 ml-auto group-hover:text-primary-600" />
                    </Link>
                  </div>
                </div>

                {/* Recommended Scholarships */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recommended for You
                    </h2>
                    <Link
                      href="/scholarships"
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            Global Excellence Scholarship 2024
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Full tuition coverage for international students
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>Amount: $50,000</span>
                            <span>Deadline: Dec 15, 2024</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-1 text-gray-400 hover:text-red-500">
                            <BookmarkIcon className="w-4 h-4" />
                          </button>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            95% Match
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            STEM Leadership Award
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            For outstanding students in Science & Technology
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>Amount: $25,000</span>
                            <span>Deadline: Jan 30, 2025</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-1 text-gray-400 hover:text-red-500">
                            <BookmarkIcon className="w-4 h-4" />
                          </button>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            87% Match
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            Merit-Based Academic Scholarship
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Recognition for academic excellence
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <span>Amount: $15,000</span>
                            <span>Deadline: Feb 15, 2025</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-1 text-gray-400 hover:text-red-500">
                            <BookmarkIcon className="w-4 h-4" />
                          </button>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            82% Match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Summary & Deadlines */}
              <div className="space-y-8">
                {/* Profile Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {profile.full_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 capitalize">
                      {profile.role} • {profile.country}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Member since{" "}
                      {new Date(profile.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          Profile Completion
                        </span>
                        <span className="font-medium text-gray-900">
                          {profileCompletion}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors inline-block"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Upcoming Deadlines
                    </h3>
                    <BellIcon className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">
                          Global Excellence
                        </p>
                        <p className="text-xs text-red-700">Due in 5 days</p>
                      </div>
                      <ClockIcon className="w-4 h-4 text-red-500" />
                    </div>

                    <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900">
                          STEM Leadership
                        </p>
                        <p className="text-xs text-yellow-700">
                          Due in 2 weeks
                        </p>
                      </div>
                      <ClockIcon className="w-4 h-4 text-yellow-500" />
                    </div>

                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">
                          Merit-Based Award
                        </p>
                        <p className="text-xs text-blue-700">Due in 1 month</p>
                      </div>
                      <ClockIcon className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>

                  <Link
                    href="/applications"
                    className="block w-full text-center text-primary-600 hover:text-primary-700 font-medium text-sm mt-4"
                  >
                    View All Applications
                  </Link>
                </div>

                {/* Pro Tip */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 p-6">
                  <h3 className="text-lg font-semibold text-primary-900 mb-3">
                    💡 Pro Tip
                  </h3>
                  <p className="text-sm text-primary-800 mb-4">
                    Apply to at least 5-10 scholarships to increase your chances
                    of success. Start with those that best match your profile!
                  </p>
                  <Link
                    href="/mentors"
                    className="text-primary-700 hover:text-primary-800 font-medium text-sm underline"
                  >
                    Get personalized guidance →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
