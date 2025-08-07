"use client";

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

interface ScholarshipFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  scholarships: Scholarship[];
}

export default function ScholarshipFilters({
  filters,
  onFilterChange,
  onClearFilters,
  scholarships,
}: ScholarshipFiltersProps) {
  // Extract unique values for filter options
  const countries = Array.from(
    new Set(scholarships.map((s) => s.country).filter(Boolean))
  ).sort();
  const degreeLevels = Array.from(
    new Set(scholarships.flatMap((s) => s.level_of_study || []).filter(Boolean))
  ).sort();

  // Remove funding types for now since it's not in our schema
  // const fundingTypes = Array.from(
  //   new Set(scholarships.map((s) => s.funding_type))
  // ).sort();

  // Extract unique fields of study
  const fieldsOfStudy = Array.from(
    new Set(scholarships.flatMap((s) => s.field_of_study || []).filter(Boolean))
  ).sort();

  const deadlineOptions = [
    { value: "", label: "Any time" },
    { value: "next_month", label: "Next month" },
    { value: "next_3_months", label: "Next 3 months" },
    { value: "next_6_months", label: "Next 6 months" },
  ];

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={filters.country}
            onChange={(e) => onFilterChange({ country: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country || ""} value={country || ""}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Degree Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Degree Level
          </label>
          <select
            value={filters.degreeLevel}
            onChange={(e) => onFilterChange({ degreeLevel: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All levels</option>
            {degreeLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Field of Study Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field of Study
          </label>
          <select
            value={filters.fieldOfStudy}
            onChange={(e) => onFilterChange({ fieldOfStudy: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All fields</option>
            {fieldsOfStudy.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        {/* Remove Funding Type Filter for now since it's not in our schema */}
        {/* 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Funding Type
          </label>
          <select
            value={filters.fundingType}
            onChange={(e) => onFilterChange({ fundingType: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All funding types</option>
            {fundingTypes.map((type) => (
              <option key={type} value={type}>
                {type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        */}

        {/* Deadline Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Deadline
          </label>
          <select
            value={filters.deadline}
            onChange={(e) => onFilterChange({ deadline: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {deadlineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Active Filters:
            </h4>
            <div className="space-y-1">
              {filters.country && (
                <div className="flex items-center justify-between text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                  <span>Country: {filters.country}</span>
                  <button
                    onClick={() => onFilterChange({ country: "" })}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.degreeLevel && (
                <div className="flex items-center justify-between text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                  <span>Level: {filters.degreeLevel}</span>
                  <button
                    onClick={() => onFilterChange({ degreeLevel: "" })}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.fieldOfStudy && (
                <div className="flex items-center justify-between text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                  <span>Field: {filters.fieldOfStudy}</span>
                  <button
                    onClick={() => onFilterChange({ fieldOfStudy: "" })}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </div>
              )}
              {filters.fundingType && (
                <div className="flex items-center justify-between text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded">
                  <span>Funding: {filters.fundingType.replace(/_/g, " ")}</span>
                  <button
                    onClick={() => onFilterChange({ fundingType: "" })}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
