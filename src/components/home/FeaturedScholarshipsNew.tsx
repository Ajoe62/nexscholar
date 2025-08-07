export default function FeaturedScholarships() {
  const scholarships = [
    {
      id: 1,
      title: "Gates Cambridge Scholarship",
      university: "University of Cambridge",
      country: "United Kingdom",
      deadline: "December 2024",
      fundingType: "Full Funding",
      field: "All Fields"
    },
    {
      id: 2,
      title: "Fulbright Foreign Student Program",
      university: "Various US Universities",
      country: "United States",
      deadline: "October 2024",
      fundingType: "Full Funding",
      field: "All Fields"
    },
    {
      id: 3,
      title: "Chevening Scholarships",
      university: "UK Universities",
      country: "United Kingdom", 
      deadline: "November 2024",
      fundingType: "Full Funding",
      field: "All Fields"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Scholarships</h2>
          <p className="text-lg text-gray-600">Discover amazing opportunities from top universities worldwide</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <div key={scholarship.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {scholarship.title}
                </h3>
                <span className="bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded-full">
                  {scholarship.fundingType}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">{scholarship.university}</p>
              <p className="text-sm text-gray-500 mb-4">{scholarship.country} • {scholarship.field}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600 font-medium">
                  Deadline: {scholarship.deadline}
                </span>
                <button className="btn-primary text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-outline">
            View All Scholarships
          </button>
        </div>
      </div>
    </section>
  );
}
