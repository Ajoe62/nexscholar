import { Search, Calendar, FileText } from "lucide-react";

const steps = [
  {
    id: 1,
    name: "Search & Discover",
    description:
      "Find scholarships that match your profile using our advanced filters and AI-powered recommendations.",
    icon: Search,
    color: "text-primary-600 bg-primary-100",
  },
  {
    id: 2,
    name: "Book Consultation",
    description:
      "Schedule one-on-one sessions with expert mentors who will guide you through the application process.",
    icon: Calendar,
    color: "text-secondary-600 bg-secondary-100",
  },
  {
    id: 3,
    name: "Submit Documents",
    description:
      "Get professional review and editing of your SOPs, CVs, and other application documents.",
    icon: FileText,
    color: "text-primary-600 bg-primary-100",
  },
];

export default function HowItWorks() {
  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How Nexscholar Works
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Three simple steps to transform your educational journey
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${step.color}`}
                  >
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="text-xl">{step.name}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Process Flow */}
        <div className="mt-16 flex justify-center">
          <div className="flex items-center space-x-4 sm:space-x-8">
            {steps.map((step, stepIdx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-semibold">
                  {step.id}
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div className="hidden sm:block w-16 h-0.5 bg-gray-300 ml-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
