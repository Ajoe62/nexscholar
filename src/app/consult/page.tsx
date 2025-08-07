"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  StarIcon,
  PhoneIcon,
  VideoIcon,
  FileTextIcon,
  CreditCardIcon,
  InfoIcon,
} from "lucide-react";

interface ConsultationBooking {
  id: string;
  user_id: string;
  consultant_name: string;
  consultation_type: string;
  scheduled_at: string;
  duration_minutes: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  meeting_link: string | null;
  documents: any;
  notes: string | null;
  fee: number;
  created_at: string;
}

interface ConsultationType {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const consultationTypes: ConsultationType[] = [
  {
    id: "application_review",
    name: "Application Review",
    description: "Get your scholarship applications reviewed by experts",
    duration: 45,
    price: 75,
    features: [
      "Personal statement review",
      "Application strategy",
      "Essay feedback",
      "Deadline planning",
      "Follow-up email support",
    ],
    icon: FileTextIcon,
  },
  {
    id: "document_review",
    name: "Document Review",
    description: "Professional review of your academic documents",
    duration: 30,
    price: 50,
    features: [
      "CV/Resume review",
      "Cover letter feedback",
      "Reference letter guidance",
      "Document formatting",
      "Improvement suggestions",
    ],
    icon: FileTextIcon,
  },
  {
    id: "interview_prep",
    name: "Interview Preparation",
    description: "Practice and prepare for scholarship interviews",
    duration: 60,
    price: 100,
    features: [
      "Mock interview sessions",
      "Common questions practice",
      "Presentation skills",
      "Confidence building",
      "Feedback and tips",
    ],
    icon: VideoIcon,
  },
  {
    id: "career_guidance",
    name: "Career Guidance",
    description: "Strategic career planning and scholarship alignment",
    duration: 60,
    price: 90,
    features: [
      "Career path planning",
      "Scholarship matching",
      "Industry insights",
      "Networking advice",
      "Long-term strategy",
    ],
    icon: UserIcon,
  },
];

const consultants = [
  {
    id: "dr_sarah_johnson",
    name: "Dr. Sarah Johnson",
    title: "Former Fulbright Scholar & Education Consultant",
    expertise: [
      "International Scholarships",
      "Graduate Programs",
      "Research Proposals",
    ],
    rating: 4.9,
    reviews: 127,
    image: "/api/placeholder/96/96",
    bio: "15+ years helping students secure international scholarships. Former Fulbright Scholar with expertise in STEM fields.",
  },
  {
    id: "prof_michael_chen",
    name: "Prof. Michael Chen",
    title: "Oxford Graduate & Academic Advisor",
    expertise: ["UK Scholarships", "Oxbridge Applications", "Academic Writing"],
    rating: 4.8,
    reviews: 89,
    image: "/api/placeholder/96/96",
    bio: "Oxford PhD graduate specializing in helping students with UK scholarship applications and academic excellence.",
  },
  {
    id: "dr_priya_patel",
    name: "Dr. Priya Patel",
    title: "Medical School Advisor & Scholarship Expert",
    expertise: [
      "Medical Scholarships",
      "Healthcare Programs",
      "Research Funding",
    ],
    rating: 4.9,
    reviews: 156,
    image: "/api/placeholder/96/96",
    bio: "Former medical school admissions officer with 12+ years in healthcare scholarship consulting.",
  },
];

export default function ConsultPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(
    null
  );
  const [selectedConsultant, setSelectedConsultant] = useState(consultants[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    preferredContact: "video",
    documents: [] as File[],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, mounted, router]);

  const fetchBookings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("consultation_bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  const handleBookConsultation = async () => {
    if (!user || !selectedType) return;

    setIsBooking(true);
    try {
      const bookingData = {
        user_id: user.id,
        consultant_name: selectedConsultant.name,
        consultation_type: selectedType.name,
        scheduled_at: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
        duration_minutes: selectedType.duration,
        status: "pending" as const,
        notes: formData.message,
        fee: selectedType.price,
        documents: formData.documents.map((f) => ({
          name: f.name,
          size: f.size,
        })),
      };

      const { error } = await supabase
        .from("consultation_bookings")
        .insert([bookingData]);

      if (error) throw error;

      alert(
        "Consultation booked successfully! You'll receive a confirmation email shortly."
      );
      setShowBookingForm(false);
      setSelectedType(null);
      fetchBookings();
    } catch (error) {
      console.error("Error booking consultation:", error);
      alert("Failed to book consultation. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) {
        // Exclude Sundays
        dates.push(date.toISOString().split("T")[0]);
      }
    }
    return dates;
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consultations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Expert Consultation Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized guidance from scholarship experts to maximize
              your chances of success
            </p>
          </div>

          {/* Consultation Types */}
          {!showBookingForm && (
            <>
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Choose Your Consultation Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {consultationTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedType?.id === type.id
                          ? "border-primary-500 shadow-lg"
                          : "border-gray-200 hover:border-primary-300"
                      }`}
                      onClick={() => setSelectedType(type)}
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <type.icon className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {type.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {type.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-center text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {type.duration} minutes
                          </div>
                          <div className="text-2xl font-bold text-primary-600">
                            ${type.price}
                          </div>
                        </div>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {type.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircleIcon className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultant Selection */}
              {selectedType && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Select Your Consultant
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {consultants.map((consultant) => (
                      <div
                        key={consultant.id}
                        className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          selectedConsultant.id === consultant.id
                            ? "border-primary-500 shadow-lg"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                        onClick={() => setSelectedConsultant(consultant)}
                      >
                        <div className="text-center">
                          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <UserIcon className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {consultant.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {consultant.title}
                          </p>
                          <div className="flex items-center justify-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(consultant.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                {consultant.rating} ({consultant.reviews})
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            {consultant.bio}
                          </p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {consultant.expertise.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Button */}
              {selectedType && (
                <div className="text-center">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors"
                  >
                    Book {selectedType.name} - ${selectedType.price}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Booking Form */}
          {showBookingForm && selectedType && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Book Your {selectedType.name}
                </h2>

                <div className="space-y-6">
                  {/* Selected Service Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedType.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          with {selectedConsultant.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedType.duration} minutes
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          ${selectedType.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a date</option>
                      {getNextWeekDates().map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Time (EST)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {generateTimeSlots().map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-2 text-sm border rounded-lg transition-colors ${
                              selectedTime === time
                                ? "bg-primary-600 text-white border-primary-600"
                                : "border-gray-300 hover:border-primary-300"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about your goals, specific questions, or what you'd like to focus on during the consultation..."
                    />
                  </div>

                  {/* Contact Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Meeting Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            preferredContact: "video",
                          })
                        }
                        className={`p-4 border rounded-lg flex items-center justify-center ${
                          formData.preferredContact === "video"
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-300"
                        }`}
                      >
                        <VideoIcon className="w-5 h-5 mr-2" />
                        Video Call
                      </button>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            preferredContact: "phone",
                          })
                        }
                        className={`p-4 border rounded-lg flex items-center justify-center ${
                          formData.preferredContact === "phone"
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-300"
                        }`}
                      >
                        <PhoneIcon className="w-5 h-5 mr-2" />
                        Phone Call
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBookConsultation}
                      disabled={!selectedDate || !selectedTime || isBooking}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {isBooking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Booking...
                        </>
                      ) : (
                        <>
                          <CreditCardIcon className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Bookings */}
          {!showBookingForm && bookings.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                My Consultations
              </h2>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white p-6 rounded-lg shadow border"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.consultation_type}
                        </h3>
                        <p className="text-sm text-gray-600">
                          with {booking.consultant_name}
                        </p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(
                              booking.scheduled_at
                            ).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {new Date(booking.scheduled_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          <span>${booking.fee}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
