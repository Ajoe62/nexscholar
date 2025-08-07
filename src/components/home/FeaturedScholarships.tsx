import Link from "next/link";
import {
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { ExternalLink } from "lucide-react";

const scholarships = [
  {
    id: 1,
    title: "Chevening Scholarships",
    university: "UK Universities",
    country: "United Kingdom",
    deadline: "2025-11-01",
    funding: "Full Funding",
    degree: "Masters",
    field: "All Fields",
    logo: "/images/chevening-logo.jpg",
    description:
      "Fully funded masters scholarships for future leaders from around the world.",
  },
  {
    id: 2,
    title: "Erasmus Mundus Joint Masters",
    university: "European Universities",
    country: "Europe",
    deadline: "2025-01-15",
    funding: "Full Funding",
    degree: "Masters",
    field: "Various",
    logo: "/images/erasmus-logo.jpg",
    description:
      "Study in multiple European countries with full scholarship coverage.",
  },
  {
    id: 3,
    title: "Australia Awards",
    university: "Australian Universities",
    country: "Australia",
    deadline: "2025-04-30",
    funding: "Full Funding",
    degree: "Masters/PhD",
    field: "All Fields",
    logo: "/images/australia-awards-logo.jpg",
    description:
      "Comprehensive scholarship program for developing country nationals.",
  },
  {
    id: 4,
    title: "DAAD Scholarships",
    university: "German Universities",
    country: "Germany",
    deadline: "2025-10-31",
    funding: "Full Funding",
    degree: "Masters/PhD",
    field: "All Fields",
    logo: "/images/daad-logo.jpg",
    description:
      "Generous scholarships for international students to study in Germany.",
  },
];

export default function FeaturedScholarships() {
  return (
    <div className="py-16 sm:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Scholarships
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Discover some of the most popular and well-funded scholarship
            opportunities
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {scholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {scholarship.title.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {scholarship.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {scholarship.university}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {scholarship.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      {scholarship.country}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4" />
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      {scholarship.funding}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{scholarship.degree}</span>{" "}
                      • {scholarship.field}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Link
                  href={`/scholarships/${scholarship.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Details
                </Link>
                <button className="btn-primary text-sm flex items-center gap-1">
                  Apply Now
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/scholarships" className="btn-outline text-lg px-8 py-3">
            View All Scholarships
          </Link>
        </div>
      </div>
    </div>
  );
}
