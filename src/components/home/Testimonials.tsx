import { StarIcon } from "@heroicons/react/20/solid";

const testimonials = [
  {
    id: 1,
    name: "Amara Okonkwo",
    location: "Lagos, Nigeria",
    university: "University of Oxford",
    scholarship: "Chevening Scholarship",
    image: "/images/testimonial-1.jpg",
    quote:
      "Nexscholar made my dream of studying at Oxford a reality. The consultation sessions were incredibly helpful, and the document review service polished my personal statement to perfection.",
    rating: 5,
  },
  {
    id: 2,
    name: "Kwame Asante",
    location: "Accra, Ghana",
    university: "MIT",
    scholarship: "MasterCard Foundation Scholarship",
    image: "/images/testimonial-2.jpg",
    quote:
      "The platform's scholarship search feature is amazing. I found opportunities I never knew existed. The mentors guided me through every step of the application process.",
    rating: 5,
  },
  {
    id: 3,
    name: "Fatima Al-Rashid",
    location: "Cairo, Egypt",
    university: "University of Toronto",
    scholarship: "Lester B. Pearson Scholarship",
    image: "/images/testimonial-3.jpg",
    quote:
      "From finding the right scholarship to getting my documents reviewed, Nexscholar was with me throughout my journey. Now I'm pursuing my PhD at one of the world's top universities.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Hear from students who have achieved their dreams through Nexscholar
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-gray-600 mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.location}
                  </div>
                  <div className="text-sm text-primary-600">
                    {testimonial.university}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-secondary-600">
                  {testimonial.scholarship}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-lg font-medium text-gray-900">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full border-2 border-white flex items-center justify-center"
                >
                  <span className="text-white text-xs font-semibold">{i}</span>
                </div>
              ))}
            </div>
            <span>Join 2,500+ successful students</span>
          </div>
        </div>
      </div>
    </div>
  );
}
