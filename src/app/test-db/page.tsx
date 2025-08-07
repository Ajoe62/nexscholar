"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      setLoading(true);
      try {
        console.log("Testing Supabase connection...");

        // Test 1: Check if we can connect at all
        console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

        // Test 2: Try to fetch from scholarships table
        const { data, error, count } = await supabase
          .from("scholarships")
          .select("*", { count: "exact" })
          .limit(5);

        console.log("Query result:", { data, error, count });

        if (error) {
          setError(error);
        } else {
          setResult({ data, count });
        }
      } catch (err) {
        console.error("Catch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>

          {loading && (
            <div className="text-blue-600">Testing connection...</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
              <h3 className="font-semibold text-red-800">Error:</h3>
              <pre className="text-sm text-red-600 mt-2 overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <h3 className="font-semibold text-green-800">Success!</h3>
              <p className="text-green-700 mt-2">
                Found {result.count} scholarships in the database
              </p>
              <details className="mt-4">
                <summary className="cursor-pointer font-medium">
                  View Raw Data
                </summary>
                <pre className="text-sm bg-gray-100 p-3 mt-2 rounded overflow-auto max-h-96">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Environment Check:</h3>
            <ul className="text-sm space-y-1">
              <li>
                Supabase URL:{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
              </li>
              <li>
                Supabase Key:{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? "✅ Set"
                  : "❌ Missing"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
