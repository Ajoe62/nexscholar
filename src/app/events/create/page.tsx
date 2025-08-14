"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeftIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface EventFormData {
  title: string;
  description: string;
  short_description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  timezone: string;
  location: string;
  meeting_link: string;
  max_attendees: string;
  registration_deadline: string;
  is_free: boolean;
  price: string;
  currency: string;
  organizer_name: string;
  organizer_email: string;
  organizer_bio: string;
  requirements: string[];
  what_you_learn: string[];
  target_audience: string[];
  tags: string[];
  status: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    short_description: "",
    event_type: "webinar",
    start_date: "",
    end_date: "",
    timezone: "UTC",
    location: "Online",
    meeting_link: "",
    max_attendees: "",
    registration_deadline: "",
    is_free: true,
    price: "",
    currency: "USD",
    organizer_name: "",
    organizer_email: "",
    organizer_bio: "",
    requirements: [""],
    what_you_learn: [""],
    target_audience: [""],
    tags: [""],
    status: "draft",
  });

  const eventTypes = [
    { value: "webinar", label: "Webinar" },
    { value: "workshop", label: "Workshop" },
    { value: "conference", label: "Conference" },
    { value: "seminar", label: "Seminar" },
    { value: "networking", label: "Networking Event" },
    { value: "info_session", label: "Info Session" },
  ];

  const currencies = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "CAD", label: "CAD ($)" },
    { value: "AUD", label: "AUD ($)" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (
    field: keyof Pick<EventFormData, "requirements" | "what_you_learn" | "target_audience" | "tags">,
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: keyof Pick<EventFormData, "requirements" | "what_you_learn" | "target_audience" | "tags">
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: keyof Pick<EventFormData, "requirements" | "what_you_learn" | "target_audience" | "tags">,
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter an event title");
      return false;
    }
    if (!formData.description.trim()) {
      alert("Please enter an event description");
      return false;
    }
    if (!formData.start_date) {
      alert("Please select a start date");
      return false;
    }
    if (!formData.end_date) {
      alert("Please select an end date");
      return false;
    }
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      alert("End date must be after start date");
      return false;
    }
    if (!formData.organizer_name.trim()) {
      alert("Please enter organizer name");
      return false;
    }
    if (!formData.is_free && !formData.price) {
      alert("Please enter a price for paid events");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent, publishNow: boolean = false) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please log in to create events");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        short_description: formData.short_description.trim() || formData.description.trim().substring(0, 150),
        event_type: formData.event_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        timezone: formData.timezone,
        location: formData.location.trim(),
        meeting_link: formData.meeting_link.trim() || null,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        registration_deadline: formData.registration_deadline || null,
        is_free: formData.is_free,
        price: formData.is_free ? 0 : parseFloat(formData.price) || 0,
        currency: formData.currency,
        organizer_name: formData.organizer_name.trim(),
        organizer_email: formData.organizer_email.trim() || null,
        organizer_bio: formData.organizer_bio.trim() || null,
        requirements: formData.requirements.filter(r => r.trim()),
        what_you_learn: formData.what_you_learn.filter(w => w.trim()),
        target_audience: formData.target_audience.filter(t => t.trim()),
        tags: formData.tags.filter(t => t.trim()),
        status: publishNow ? "published" : formData.status,
        created_by: user.id,
      };

      const { data, error } = await (supabase as any)
        .from("events")
        .insert([eventData])
        .select()
        .single();

      if (error) {
        console.error("Error creating event:", error);
        alert("Error creating event. Please try again.");
        return;
      }

      alert(`Event ${publishNow ? "published" : "saved as draft"} successfully!`);
      router.push(`/events/${data.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please Log In
          </h1>
          <p className="text-gray-600 mb-8">
            You need to be logged in to create events.
          </p>
          <Link href="/auth/login" className="btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/events/my-events"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Create New Event
                </h1>
                <p className="text-gray-600 mt-2">
                  Share knowledge and connect with your community
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Fulbright Application Masterclass"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Online, New York, etc."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Brief description for event cards (optional - will use main description if empty)"
                  maxLength={150}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.short_description.length}/150 characters
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="input-field"
                  placeholder="Detailed description of your event..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  name="registration_deadline"
                  value={formData.registration_deadline}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attendees
                </label>
                <input
                  type="number"
                  name="max_attendees"
                  value={formData.max_attendees}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link (for virtual events)
                </label>
                <input
                  type="url"
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_free"
                  checked={formData.is_free}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  This is a free event
                </label>
              </div>

              {!formData.is_free && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required={!formData.is_free}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Organizer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Organizer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  name="organizer_name"
                  value={formData.organizer_name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Your name or organization"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizer Email
                </label>
                <input
                  type="email"
                  name="organizer_email"
                  value={formData.organizer_email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="contact@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organizer Bio
                </label>
                <textarea
                  name="organizer_bio"
                  value={formData.organizer_bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="Brief bio or description of the organizer..."
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Event Details
            </h2>

            {/* Requirements */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) =>
                      handleArrayChange("requirements", index, e.target.value)
                    }
                    className="input-field flex-1"
                    placeholder="e.g., Basic knowledge of scholarships"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("requirements", index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("requirements")}
                className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Requirement
              </button>
            </div>

            {/* What You'll Learn */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What Attendees Will Learn
              </label>
              {formData.what_you_learn.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleArrayChange("what_you_learn", index, e.target.value)
                    }
                    className="input-field flex-1"
                    placeholder="e.g., How to write compelling essays"
                  />
                  {formData.what_you_learn.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("what_you_learn", index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("what_you_learn")}
                className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Learning Outcome
              </button>
            </div>

            {/* Target Audience */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              {formData.target_audience.map((audience, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) =>
                      handleArrayChange("target_audience", index, e.target.value)
                    }
                    className="input-field flex-1"
                    placeholder="e.g., Graduate students"
                  />
                  {formData.target_audience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("target_audience", index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("target_audience")}
                className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Target Audience
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) =>
                      handleArrayChange("tags", index, e.target.value)
                    }
                    className="input-field flex-1"
                    placeholder="e.g., scholarship, fulbright"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("tags", index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("tags")}
                className="flex items-center text-primary-600 hover:text-primary-800 text-sm"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Tag
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <Link
                  href="/events/my-events"
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-outline"
                >
                  {loading ? "Saving..." : "Save as Draft"}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Publishing..." : "Publish Event"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
