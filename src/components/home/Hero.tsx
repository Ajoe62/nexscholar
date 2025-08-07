"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon as SearchIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Find Your
            <span className="text-primary-600"> Dream </span>
            Scholarship
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
            Discover global scholarship opportunities, get expert consultation,
            and receive professional document review services. Your path to
            international education starts here.
          </p>

          {/* Search Bar */}
          <div className="mt-10 flex justify-center">
            <div className="w-full max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                  placeholder="Search scholarships by country, field, or university..."
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {[
                  "Computer Science",
                  "Medicine",
                  "Engineering",
                  "Business",
                ].map((field) => (
                  <button
                    key={field}
                    className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/scholarships"
              className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
            >
              Browse Scholarships
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/consultation"
              className="btn-outline flex items-center gap-2 text-lg px-8 py-3"
            >
              <GlobeAltIcon className="h-5 w-5" />
              Get Expert Help
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">5,000+</div>
              <div className="text-gray-600">Active Scholarships</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-500">
                2,500+
              </div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
