"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkSolidIcon,
} from "@heroicons/react/24/solid";

interface Event {
  id: string;
  title: string;
  description: string;
  short_description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  timezone: string;
  location: string;
  meeting_link?: string;
  max_attendees?: number;
  current_attendees: number;
  registration_deadline?: string;
  is_free: boolean;
  price?: number;
  currency: string;
  image_url?: string;
  organizer_name: string;
  organizer_email?: string;
  organizer_bio?: string;
  organizer_avatar?: string;
  requirements: string[];
  what_you_learn: string[];
  target_audience: string[];
  tags: string[];
  status: string;
  is_registered?: boolean;
}

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [registering, setRegistering] = useState(false);
  const { user } = useAuth();

  const fetchEventDetails = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("events")
        .select(`
          *,
          event_registrations(user_id)
        `)
        .eq("id", eventId)
        .eq("status", "published")
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        setNotFound(true);
        return;
      }

      if (data) {
        setEvent({
          ...data,
          is_registered: user
            ? data.event_registrations.some(
                (reg: any) => reg.user_id === user.id
              )
            : false,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [eventId, user]);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, fetchEventDetails]);

  const handleRegister = async () => {
    if (!user || !event) {
      alert("Please log in to register for events");
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from("event_registrations")
        .insert([
          {
            event_id: event.id,
            user_id: user.id,
          },
        ]);

      if (error) {
        console.error("Error registering for event:", error);
        alert("Error registering for event. Please try again.");
        return;
      }

      alert("Successfully registered for event!");
      
      // Update the event state to show registration
      setEvent({
        ...event,
        is_registered: true,
        current_attendees: event.current_attendees + 1,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Error registering for event. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      webinar: "bg-blue-100 text-blue-800",
      workshop: "bg-green-100 text-green-800",
      conference: "bg-purple-100 text-purple-800",
      seminar: "bg-orange-100 text-orange-800",
      networking: "bg-pink-100 text-pink-800",
      info_session: "bg-indigo-100 text-indigo-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const isEventPast = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isRegistrationClosed = (event: Event) => {
    if (event.registration_deadline) {
      return new Date(event.registration_deadline) < new Date();
    }
    return isEventPast(event.start_date);
  };

  const isEventFull = (event: Event) => {
    return event.max_attendees && event.current_attendees >= event.max_attendees;
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.short_description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert("Event URL copied to clipboard!");
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert("Event URL copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Event Image */}
              {event.image_url ? (
                <Image
                  src={event.image_url}
                  alt={event.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-6">
                  <CalendarDaysIcon className="h-24 w-24 text-primary-600" />
                </div>
              )}

              {/* Event Type Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(
                  event.event_type
                )} mb-4`}
              >
                {event.event_type.replace("_", " ").toUpperCase()}
              </span>

              {/* Title and Actions */}
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex-1 mr-4">
                  {event.title}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* What You'll Learn */}
              {event.what_you_learn && event.what_you_learn.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    What You&apos;ll Learn
                  </h2>
                  <ul className="list-disc list-inside space-y-2">
                    {event.what_you_learn.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && event.requirements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Requirements
                  </h2>
                  <ul className="list-disc list-inside space-y-2">
                    {event.requirements.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Audience */}
              {event.target_audience && event.target_audience.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Who Should Attend
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {event.target_audience.map((audience, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-sm"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Organizer
                </h2>
                <div className="flex items-start space-x-4">
                  {event.organizer_avatar ? (
                    <Image
                      src={event.organizer_avatar}
                      alt={event.organizer_name}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-full"
                    />
                  ) : (
                    <div className="w-15 h-15 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {event.organizer_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {event.organizer_name}
                    </h3>
                    {event.organizer_bio && (
                      <p className="text-gray-600 text-sm mt-1">
                        {event.organizer_bio}
                      </p>
                    )}
                    {event.organizer_email && (
                      <p className="text-primary-600 text-sm mt-1">
                        {event.organizer_email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                {/* Event Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <CalendarDaysIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className="font-medium">{formatDate(event.start_date)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-700">
                    <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div>{formatTime(event.start_date)}</div>
                      <div className="text-gray-500">
                        to {formatTime(event.end_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-700">
                    <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                    <div>{event.location}</div>
                  </div>

                  {event.max_attendees && (
                    <div className="flex items-center text-sm text-gray-700">
                      <UserGroupIcon className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <div>
                          {event.current_attendees} / {event.max_attendees} attendees
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (event.current_attendees / event.max_attendees) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  {event.is_free ? (
                    <div className="text-center">
                      <span className="text-2xl font-bold text-green-600">Free</span>
                      <p className="text-sm text-gray-500 mt-1">No cost to attend</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {event.currency} {event.price}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">Registration fee</p>
                    </div>
                  )}
                </div>

                {/* Registration Button */}
                <div className="space-y-3">
                  {!isEventPast(event.end_date) && !event.is_registered && (
                    <button
                      onClick={handleRegister}
                      disabled={
                        registering ||
                        isRegistrationClosed(event) ||
                        isEventFull(event) ||
                        !user
                      }
                      className={`w-full py-3 px-4 rounded-lg font-medium ${
                        registering ||
                        isRegistrationClosed(event) ||
                        isEventFull(event) ||
                        !user
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "btn-primary"
                      }`}
                    >
                      {registering
                        ? "Registering..."
                        : isEventFull(event)
                        ? "Event Full"
                        : isRegistrationClosed(event)
                        ? "Registration Closed"
                        : !user
                        ? "Login to Register"
                        : "Register for Event"}
                    </button>
                  )}

                  {event.is_registered && (
                    <div className="w-full py-3 px-4 bg-green-100 text-green-800 rounded-lg text-center font-medium">
                      ✓ You&apos;re Registered
                    </div>
                  )}

                  {isEventPast(event.end_date) && (
                    <div className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-lg text-center font-medium">
                      Event Completed
                    </div>
                  )}

                  {event.meeting_link && event.is_registered && (
                    <a
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-outline text-center block"
                    >
                      Join Event
                    </a>
                  )}
                </div>

                {/* Registration Deadline */}
                {event.registration_deadline && !isRegistrationClosed(event) && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-700">
                      <strong>Registration closes:</strong>
                      <br />
                      {formatDate(event.registration_deadline)}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
