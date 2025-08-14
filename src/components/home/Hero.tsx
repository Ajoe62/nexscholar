"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon as SearchIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-background.jpg"
          alt="Students studying"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Find Your
              <span className="text-primary-600"> Dream </span>
              Scholarship
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl lg:max-w-none">
              Discover global scholarship opportunities, get expert consultation,
              and receive professional document review services. Your path to
              international education starts here.
            </p>

            {/* Search Bar */}
            <div className="mt-10">
              <div className="w-full max-w-lg lg:max-w-none">
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
                <div className="mt-4 flex flex-wrap gap-2">
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
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
              <Link
                href="/scholarships"
                className="btn-primary flex items-center gap-2 text-lg px-8 py-3 w-full sm:w-auto justify-center"
              >
                Browse Scholarships
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/consult"
                className="btn-outline flex items-center gap-2 text-lg px-8 py-3 w-full sm:w-auto justify-center"
              >
                <GlobeAltIcon className="h-5 w-5" />
                Get Expert Help
              </Link>
            </div>
          </div>

          {/* Right Content - Hero Images */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Main Hero Image */}
              <div className="relative z-10">
                <Image
                  src="/images/hero/hero-students.png"
                  alt="Happy students celebrating success"
                  width={500}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
              </div>
              
              {/* Secondary Image - Overlaid */}
              <div className="absolute -bottom-6 -right-6 z-20">
                <Image
                  src="/images/hero/hero-group-students.png"
                  alt="Group of diverse students"
                  width={300}
                  height={200}
                  className="rounded-xl shadow-xl border-4 border-white"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-primary-200 rounded-full -translate-x-12 -translate-y-12 opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary-200 rounded-full translate-x-16 translate-y-16 opacity-40"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 text-center lg:text-left">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary-600">5,000+</div>
            <div className="text-gray-600">Active Scholarships</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-secondary-500">2,500+</div>
            <div className="text-gray-600">Students Helped</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary-600">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
