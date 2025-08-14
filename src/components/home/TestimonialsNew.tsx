import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Amara Okafor",
      university: "Harvard University",
      country: "Nigeria",
      text: "Nexscholar helped me navigate the complex scholarship application process. I'm now studying my dream course at Harvard!",
      image: "/images/testimonials/testonial-1.jpg",
    },
    {
      id: 2,
      name: "David Kimani",
      university: "Oxford University",
      country: "Kenya",
      text: "The mentorship program was invaluable. My mentor guided me through every step of my Rhodes Scholarship application.",
      image: "/images/testimonials/testimonial-2.jpg",
    },
    {
      id: 3,
      name: "Sarah Mutamba",
      university: "MIT",
      country: "Zambia",
      text: "The document review service helped me craft a compelling personal statement. I couldn't have done it without Nexscholar!",
      image: "/images/testimonials/testimonial-3.jpg",
    },
    {
      id: 4,
      name: "Chen Wei",
      university: "Stanford University",
      country: "Singapore",
      text: "The scholarship database is incredible! I found opportunities I never knew existed and landed a full scholarship.",
      image: "/images/testimonials/testimonial-4.jpg",
    },
    {
      id: 5,
      name: "Maria Santos",
      university: "Cambridge University",
      country: "Brazil",
      text: "The consultation sessions were game-changing. My advisor helped me present my story in the most compelling way.",
      image: "/images/testimonials/testimonial-5.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from students who achieved their dreams through Nexscholar and are now studying at top universities worldwide
          </p>
        </div>

        {/* Featured Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-primary-600 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center">
                <div className="relative w-16 h-16 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} - ${testimonial.university}`}
                    fill
                    className="rounded-full object-cover ring-4 ring-primary-100"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-primary-600 font-medium">
                    {testimonial.university}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                    {testimonial.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Testimonials Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.slice(3, 5).map((testimonial) => (
            <div key={testimonial.id} className="card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} - ${testimonial.university}`}
                    fill
                    className="rounded-full object-cover ring-4 ring-primary-100"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <svg
                      className="w-6 h-6 text-primary-600 mb-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-gray-700 italic leading-relaxed">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-primary-600 font-medium">
                      {testimonial.university}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                      {testimonial.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-lg opacity-90 mb-6">Join thousands of students who have successfully secured scholarships</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/scholarships"
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Browse Scholarships
              </a>
              <a
                href="/consult"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                Get Free Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
