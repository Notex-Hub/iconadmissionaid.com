import { useState } from "react";

// Sample event data from the structure you provided
const events = [
  {
    _id: "67ca035d795370a4de262995",
    event_name: "Tech Conference 2025",
    date: "2025-04-15T00:00:00.000Z",
    time: "09:00 AM",
    location: "Tech Hall, Dhaka Convention Center",
    organizer: "Tech Innovators Ltd.",
    description: "A conference bringing together top minds in technology to discuss future trends.",
    registration_required: true,
    rsvp_count: 150,
    contact: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+8801234567890"
    }
  },
  // Add more events as needed
];

export function CampusLife() {
  const [registeredEvents, setRegisteredEvents] = useState([]); // We now store event IDs as strings

  const handleEventRegistration = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId));
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="text-2xl font-semibold mb-4">Campus Life</div>
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-200 rounded-lg">Events</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg">Clubs</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg">Resources</button>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="border p-4 rounded-lg">
              <div className="text-lg font-semibold">{event.event_name}</div>
              <div className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString()} • {event.time}
              </div>
              <div className="text-sm text-gray-500">{event.location}</div>
              <p className="mt-2 text-sm">{event.description}</p>
              {event.registration_required && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>Registration required</p>
                  <p>RSVP Count: {event.rsvp_count}</p>
                </div>
              )}

              <button
                className={`mt-4 px-6 py-2 rounded-lg ${
                  registeredEvents.includes(event._id)
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
                onClick={() => handleEventRegistration(event._id)}
              >
                {registeredEvents.includes(event._id) ? "Unregister" : "Register"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
