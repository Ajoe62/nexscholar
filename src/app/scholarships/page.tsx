"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/layout/Header";
import ScholarshipSearch from "@/components/scholarships/ScholarshipSearch";
import ScholarshipFilters from "@/components/scholarships/ScholarshipFilters";
import ScholarshipCard from "@/components/scholarships/ScholarshipCard";
import ScholarshipLoading from "@/components/scholarships/ScholarshipLoading";
import ScholarshipNotFound from "@/components/scholarships/ScholarshipNotFound";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type Scholarship = Database["public"]["Tables"]["scholarships"]["Row"];

interface FilterState {
  search: string;
  country: string;
  degreeLevel: string;
  fieldOfStudy: string;
  fundingType: string;
  deadline: string;
}

const initialFilters: FilterState = {
  search: "",
  country: "",
  degreeLevel: "",
  fieldOfStudy: "",
  fundingType: "",
  deadline: "",
};

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false); // Start with false for SSG
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [mounted, setMounted] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch scholarships from Supabase
  useEffect(() => {
    if (!mounted) return; // Don't fetch during SSR/SSG

    const fetchScholarships = async () => {
      try {
        setLoading(true);

        // Check if Supabase is properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (
          !supabaseUrl ||
          supabaseUrl.includes("your_project_url_here") ||
          supabaseUrl.includes("your_supabase_url_here") ||
          supabaseUrl === "https://placeholder.supabase.co"
        ) {
          setError(
            "Supabase is not configured. Please set up your environment variables."
          );
          return;
        }

        const { data, error } = await supabase
          .from("scholarships")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setScholarships(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch scholarships"
        );
        console.error("Error fetching scholarships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [mounted]);

  // Filter scholarships based on current filters
  const filteredScholarships = useMemo(() => {
    if (!scholarships.length) return [];

    return scholarships.filter((scholarship) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          scholarship.title.toLowerCase().includes(searchLower) ||
          scholarship.description?.toLowerCase().includes(searchLower) ||
          scholarship.organization?.toLowerCase().includes(searchLower) ||
          scholarship.country?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Country filter
      if (filters.country && scholarship.country !== filters.country) {
        return false;
      }

      // Degree level filter (using level_of_study array)
      if (filters.degreeLevel && scholarship.level_of_study) {
        if (!scholarship.level_of_study.includes(filters.degreeLevel)) {
          return false;
        }
      }

      // Field of study filter
      if (filters.fieldOfStudy && scholarship.field_of_study) {
        if (!scholarship.field_of_study.includes(filters.fieldOfStudy)) {
          return false;
        }
      }

      // Skip funding type filter for now (not in our schema)
      // if (filters.fundingType && scholarship.funding_type !== filters.fundingType) {
      //   return false;
      // }

      // Deadline filter
      if (filters.deadline) {
        const now = new Date();
        const deadline = new Date(scholarship.deadline);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.deadline) {
          case "next_month":
            if (diffDays > 30) return false;
            break;
          case "next_3_months":
            if (diffDays > 90) return false;
            break;
          case "next_6_months":
            if (diffDays > 180) return false;
            break;
        }
      }

      return true;
    });
  }, [scholarships, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  // Show setup message during SSG or when Supabase is not configured
  if (!mounted || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error && error.includes("Supabase is not configured")
                ? "Setup Required"
                : "Find Your Perfect Scholarship"}
            </h1>
            {error ? (
              <>
                <p className="text-gray-600 mb-8">{error}</p>
                {error.includes("Supabase is not configured") ? (
                  <div className="max-w-md mx-auto text-left bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">
                      To enable scholarship data:
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                      <li>
                        Create a Supabase project at{" "}
                        <a href="https://supabase.com" className="underline">
                          supabase.com
                        </a>
                      </li>
                      <li>Copy your project URL and API key</li>
                      <li>
                        Create a{" "}
                        <code className="bg-blue-100 px-1 rounded">
                          .env.local
                        </code>{" "}
                        file
                      </li>
                      <li>Add your Supabase credentials</li>
                      <li>
                        Run the database schema from{" "}
                        <code className="bg-blue-100 px-1 rounded">
                          supabase/schema.sql
                        </code>
                      </li>
                    </ol>
                    <p className="mt-4 text-xs text-blue-600">
                      See{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        SUPABASE_SETUP.md
                      </code>{" "}
                      for detailed instructions.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </>
            ) : (
              <p className="text-gray-600">
                Loading scholarship discovery platform...
              </p>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Your Perfect Scholarship
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Discover thousands of scholarship opportunities from
                universities and organizations worldwide. Your journey to
                academic excellence starts here.
              </p>

              <ScholarshipSearch
                searchTerm={filters.search}
                onSearchChange={(term) => handleFilterChange({ search: term })}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </section>

        {/* Scholarships Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar for filters */}
              <div className="lg:w-80">
                <ScholarshipFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  scholarships={scholarships}
                />
              </div>

              {/* Main content */}
              <div className="flex-1">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Available Scholarships
                  </h2>
                  <p className="text-gray-600">
                    {loading
                      ? "Loading scholarships..."
                      : `Showing ${filteredScholarships.length} of ${scholarships.length} scholarships`}
                  </p>
                </div>

                {/* Scholarship grid */}
                <div className="grid gap-6">
                  {loading ? (
                    <ScholarshipLoading count={6} />
                  ) : filteredScholarships.length === 0 ? (
                    <ScholarshipNotFound
                      searchTerm={filters.search}
                      hasFilters={hasActiveFilters}
                      onClearFilters={handleClearFilters}
                    />
                  ) : (
                    filteredScholarships.map((scholarship) => (
                      <ScholarshipCard
                        key={scholarship.id}
                        scholarship={scholarship}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
