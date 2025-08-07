"use client";

import {
  Calendar,
  MapPin,
  DollarSign,
  GraduationCap,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Database } from "@/lib/database.types";

type Scholarship = Database["public"]["Tables"]["scholarships"]["Row"];

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export default function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Deadline passed";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `${diffDays} days left`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks left`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDeadlineColor = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-red-600 bg-red-50";
    if (diffDays <= 7) return "text-orange-600 bg-orange-50";
    if (diffDays <= 30) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const formatFundingType = (fundingType: string) => {
    return fundingType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {scholarship.title}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getDeadlineColor(
              scholarship.deadline
            )}`}
          >
            <Clock className="w-3 h-3 inline mr-1" />
            {formatDeadline(scholarship.deadline)}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {scholarship.description}
        </p>
      </div>

      {/* Details */}
      <div className="px-6 pb-4 space-y-3">
        {/* Location */}
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{scholarship.country}</span>
          {scholarship.organization && (
            <>
              <span className="mx-2">•</span>
              <span className="font-medium">{scholarship.organization}</span>
            </>
          )}
        </div>

        {/* Degree Level */}
        <div className="flex items-center text-sm text-gray-600">
          <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
          <span className="capitalize">
            {scholarship.level_of_study?.[0] || "Various levels"}
          </span>
        </div>

        {/* Funding Information */}
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
          <span>{scholarship.currency}</span>
          {scholarship.amount && (
            <>
              <span className="mx-2">•</span>
              <span className="font-semibold text-green-600">
                {scholarship.amount.toLocaleString()}
              </span>
            </>
          )}
        </div>

        {/* Fields of Study */}
        {scholarship.field_of_study &&
          scholarship.field_of_study.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {scholarship.field_of_study.slice(0, 3).map((field, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                >
                  {field}
                </span>
              ))}
              {scholarship.field_of_study.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                  +{scholarship.field_of_study.length - 3} more
                </span>
              )}
            </div>
          )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>
              Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
              Save
            </button>
            {scholarship.application_url && (
              <a
                href={scholarship.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors inline-flex items-center gap-1"
              >
                Apply Now
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
