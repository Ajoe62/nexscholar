export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Amara Okafor",
      university: "Harvard University",
      country: "Nigeria",
      text: "Nexscholar helped me navigate the complex scholarship application process. I'm now studying my dream course at Harvard!",
      avatar: "AO",
    },
    {
      id: 2,
      name: "David Kimani",
      university: "Oxford University",
      country: "Kenya",
      text: "The mentorship program was invaluable. My mentor guided me through every step of my Rhodes Scholarship application.",
      avatar: "DK",
    },
    {
      id: 3,
      name: "Sarah Mutamba",
      university: "MIT",
      country: "Zambia",
      text: "The document review service helped me craft a compelling personal statement. I couldn't have done it without Nexscholar!",
      avatar: "SM",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600">
            Hear from students who achieved their dreams through Nexscholar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card">
              <div className="mb-4">
                <svg
                  className="w-8 h-8 text-primary-600 mb-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mr-4 font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.university}
                  </p>
                  <p className="text-xs text-gray-400">{testimonial.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
