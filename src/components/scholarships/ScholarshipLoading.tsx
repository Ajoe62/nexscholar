"use client";

import { Loader2 } from "lucide-react";

interface ScholarshipLoadingProps {
  count?: number;
}

export default function ScholarshipLoading({
  count = 6,
}: ScholarshipLoadingProps) {
  return (
    <>
      {/* Loading header */}
      <div className="col-span-full flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading scholarships...</span>
        </div>
      </div>

      {/* Loading skeleton cards */}
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse"
        >
          {/* Header skeleton */}
          <div className="p-6 pb-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 mr-4">
                <div className="h-5 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            </div>

            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded-md"></div>
              <div className="h-3 bg-gray-200 rounded-md w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded-md w-4/6"></div>
            </div>
          </div>

          {/* Details skeleton */}
          <div className="px-6 pb-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded-md w-32"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded-md w-24"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded-md w-40"></div>
            </div>

            {/* Tags skeleton */}
            <div className="flex gap-2 mt-3">
              <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
              <div className="h-6 w-14 bg-gray-200 rounded-md"></div>
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-200 rounded-md w-24"></div>
              <div className="flex gap-2">
                <div className="h-7 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-7 w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
