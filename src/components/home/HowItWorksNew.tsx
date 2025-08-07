export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Search",
      description: "Find scholarships that match your profile and academic goals"
    },
    {
      number: "2", 
      title: "Consult",
      description: "Get expert guidance from experienced mentors and advisors"
    },
    {
      number: "3",
      title: "Apply",
      description: "Submit your applications with confidence and professional support"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Nexscholar Works</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Our simple three-step process helps you discover and secure scholarship opportunities
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-2xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
