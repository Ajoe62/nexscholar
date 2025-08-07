"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

export default function SimpleScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        console.log("Fetching scholarships...");

        const { data, error } = await supabase
          .from("scholarships")
          .select("*")
          .eq("status", "active");

        console.log("Fetch result:", { data, error });

        if (error) {
          throw error;
        }

        setScholarships(data || []);
      } catch (err: any) {
        console.error("Error fetching scholarships:", err);
        setError(err.message || "Failed to fetch scholarships");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Available Scholarships
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover opportunities to fund your education
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading scholarships...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Found {scholarships.length} scholarships
              </p>

              {scholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-white p-6 rounded-lg shadow border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {scholarship.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {scholarship.description?.substring(0, 200)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">
                        {scholarship.currency}{" "}
                        {scholarship.amount?.toLocaleString()}
                      </span>
                      {scholarship.organization && (
                        <span className="ml-4">
                          by {scholarship.organization}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Deadline:{" "}
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
