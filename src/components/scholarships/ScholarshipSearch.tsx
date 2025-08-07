"use client";

import { Search } from "lucide-react";

interface ScholarshipSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export default function ScholarshipSearch({
  searchTerm,
  onSearchChange,
  onSearch,
}: ScholarshipSearchProps) {
  const popularSearches = [
    "Computer Science",
    "Medicine",
    "Engineering",
    "Business",
    "UK",
    "USA",
    "Masters",
    "PhD",
  ];

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch(searchTerm);
            }
          }}
          className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
          placeholder="Search scholarships by keyword, university, country..."
        />
      </div>

      {/* Popular Searches */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search) => (
            <button
              key={search}
              onClick={() => onSearchChange(search)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
