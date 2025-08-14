"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface Event {
  id: string;
  title: string;
  description: string;
  short_description: string;
  event_type: string;
  start_date: string;
  end_date: string;
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
  organizer_avatar?: string;
  tags: string[];
  status: string;
  is_registered?: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("upcoming");
  const { user } = useAuth();

  const eventTypes = [
    { value: "all", label: "All Types" },
    { value: "webinar", label: "Webinar" },
    { value: "workshop", label: "Workshop" },
    { value: "conference", label: "Conference" },
    { value: "seminar", label: "Seminar" },
    { value: "networking", label: "Networking" },
    { value: "info_session", label: "Info Session" },
  ];

  const statusFilters = [
    { value: "upcoming", label: "Upcoming" },
    { value: "all", label: "All Events" },
    { value: "past", label: "Past Events" },
  ];

  const fetchEvents = useCallback(async () => {
    try {
      let query = (supabase as any)
        .from("events")
        .select(`
          *,
          event_registrations(user_id)
        `)
        .eq("status", "published")
        .order("start_date", { ascending: true });

      // Apply date filter
      if (selectedStatus === "upcoming") {
        query = query.gte("start_date", new Date().toISOString());
      } else if (selectedStatus === "past") {
        query = query.lt("start_date", new Date().toISOString());
      }

      // Apply type filter
      if (selectedType !== "all") {
        query = query.eq("event_type", selectedType);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching events:", error);
        return;
      }

      const eventsWithRegistration = data.map((event: any) => ({
        ...event,
        is_registered: user
          ? event.event_registrations.some(
              (reg: any) => reg.user_id === user.id
            )
          : false,
      }));

      setEvents(eventsWithRegistration);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedStatus, searchQuery, user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      alert("Please log in to register for events");
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from("event_registrations")
        .insert([
          {
            event_id: eventId,
            user_id: user.id,
          },
        ]);

      if (error) {
        console.error("Error registering for event:", error);
        alert("Error registering for event. Please try again.");
        return;
      }

      alert("Successfully registered for event!");
      fetchEvents(); // Refresh events to update registration status
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Events & Workshops
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our educational events, workshops, and webinars to enhance your
              scholarship application skills and connect with experts in the field.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search events..."
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input-field"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                {statusFilters.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No events found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or check back later for new events.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Event Image */}
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <CalendarDaysIcon className="h-16 w-16 text-primary-600" />
                  </div>
                )}

                <div className="p-6">
                  {/* Event Type Badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(
                      event.event_type
                    )} mb-3`}
                  >
                    {event.event_type.replace("_", " ").toUpperCase()}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.short_description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {formatDate(event.start_date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {formatTime(event.start_date)} - {formatTime(event.end_date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {event.current_attendees}/{event.max_attendees} attendees
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {event.is_free ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      <span className="text-gray-900 font-semibold">
                        {event.currency} {event.price}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            #{tag}
                          </span>
                        ))}
                        {event.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{event.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex gap-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="flex-1 btn-outline text-center"
                    >
                      View Details
                    </Link>
                    {!isEventPast(event.end_date) && !event.is_registered && (
                      <button
                        onClick={() => handleRegister(event.id)}
                        disabled={
                          isRegistrationClosed(event) ||
                          isEventFull(event) ||
                          !user
                        }
                        className={`flex-1 ${
                          isRegistrationClosed(event) || isEventFull(event) || !user
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "btn-primary"
                        }`}
                      >
                        {isEventFull(event)
                          ? "Full"
                          : isRegistrationClosed(event)
                          ? "Closed"
                          : !user
                          ? "Login to Register"
                          : "Register"}
                      </button>
                    )}
                    {event.is_registered && (
                      <span className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center text-sm font-medium">
                        Registered ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
