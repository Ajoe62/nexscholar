"use client";

import { AlertCircle, FileX } from "lucide-react";

interface ScholarshipNotFoundProps {
  searchTerm?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export default function ScholarshipNotFound({
  searchTerm,
  hasFilters,
  onClearFilters,
}: ScholarshipNotFoundProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FileX className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No scholarships found
      </h3>

      <p className="text-gray-600 mb-6 max-w-md">
        {searchTerm
          ? `We couldn't find any scholarships matching "${searchTerm}".`
          : "We couldn't find any scholarships matching your current filters."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors"
          >
            Clear all filters
          </button>
        )}

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
        >
          Browse all scholarships
        </button>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-left">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Can&apos;t find what you&apos;re looking for?
            </h4>
            <p className="text-sm text-blue-700">
              Our scholarship database is constantly updated. Try broadening
              your search criteria or check back later for new opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
