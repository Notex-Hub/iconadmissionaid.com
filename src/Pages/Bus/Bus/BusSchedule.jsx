import { Bus } from 'lucide-react';
import { useState } from 'react';
import {  MapPin, Bell, AlertTriangle } from 'react-feather';
import Schedule from '../Schedule/Schedule';
import RealTimeDate from '../../../Components/RealTimeDate';

const BusSchedule = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('routes'); // Track active tab

  const busRoutes = [
    {
      id: "route-a",
      name: "Route A",
      description: "Main Campus → North Campus",
      stops: [
        { name: "Main Campus", times: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"] },
        { name: "Library", times: ["8:05 AM", "10:05 AM", "12:05 PM", "2:05 PM", "4:05 PM", "6:05 PM"] },
        { name: "Science Building", times: ["8:10 AM", "10:10 AM", "12:10 PM", "2:10 PM", "4:10 PM", "6:10 PM"] },
        { name: "North Campus", times: ["8:15 AM", "10:15 AM", "12:15 PM", "2:15 PM", "4:15 PM", "6:15 PM"] },
      ],
      status: "on-time",
      nextBus: "10:00 AM",
    },
    {
      id: "route-b",
      name: "Route B",
      description: "Main Campus → Downtown",
      stops: [
        { name: "Main Campus", times: ["7:30 AM", "9:30 AM", "11:30 AM", "1:30 PM", "3:30 PM", "5:30 PM"] },
        { name: "Student Center", times: ["7:35 AM", "9:35 AM", "11:35 AM", "1:35 PM", "3:35 PM", "5:35 PM"] },
        { name: "Downtown Station", times: ["7:45 AM", "9:45 AM", "11:45 AM", "1:45 PM", "3:45 PM", "5:45 PM"] },
        { name: "City Hall", times: ["7:50 AM", "9:50 AM", "11:50 AM", "1:50 PM", "3:50 PM", "5:50 PM"] },
      ],
      status: "delayed",
      delay: "10 minutes",
      nextBus: "9:40 AM",
    },
    {
      id: "route-c",
      name: "Route C",
      description: "Main Campus → Residence Halls",
      stops: [
        { name: "Main Campus", times: ["8:15 AM", "10:15 AM", "12:15 PM", "2:15 PM", "4:15 PM", "6:15 PM"] },
        { name: "Dining Hall", times: ["8:18 AM", "10:18 AM", "12:18 PM", "2:18 PM", "4:18 PM", "6:18 PM"] },
        { name: "Residence Hall A", times: ["8:22 AM", "10:22 AM", "12:22 PM", "2:22 PM", "4:22 PM", "6:22 PM"] },
      ],
      status: "on-time",
      nextBus: "10:15 AM",
    },
  ];

  const filteredRoutes = busRoutes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.stops.some(stop => stop.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const subscribeToAlerts = (routeName) => {
    console.log(`Subscribed to alerts for ${routeName}`);
  };

  return (
    <div className="space-y-4 container mx-auto my-4 p-4">
      <div className="flex items-center justify-between flex-col md:flex-row ">
        <h2 className="text-xl font-bold tracking-tight">Bus Schedule</h2>
        <div className="flex items-center space-x-2">
       <RealTimeDate/>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search</label>
            <input
              id="search"
              className="input w-full"
              placeholder="Search routes or stops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <label htmlFor="notifications" className="text-sm">Notifications</label>
          </div>
        </div>

        {busRoutes.some(route => route.status === "delayed") && (
          <div className="alert alert-destructive p-4 flex items-center space-x-2 bg-red-500 text-white rounded-md">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <div className="font-semibold">Service Disruption</div>
              <div>Route B is currently delayed by 10 minutes due to traffic.</div>
            </div>
          </div>
        )}

        <div className="tabs ">
          <div className="flex gap-10 bg-gray-100  overflow-hidden px-5 py-2 rounded-md">
            <button
              className={`tab-trigger w-full py-2 text-sm font-medium ${activeTab === 'routes' ? 'bg-white text-black font-semibold px-2 py-2 rounded-lg' : 'text-gray-600 cursor-pointer'}`}
              onClick={() => setActiveTab('routes')}
            >
              Routes
            </button>
            <button
              className={`tab-trigger w-full py-2 text-sm font-medium ${activeTab === 'map' ? 'bg-white text-black font-semibold px-2 py-2 rounded-lg' : 'text-gray-600 cursor-pointer'}`}
              onClick={() => setActiveTab('map')}
            >
              Map
            </button>
            <button
              className={`tab-trigger w-full py-2 text-sm font-medium ${activeTab === 'alerts' ? 'bg-white text-black font-semibold px-2 py-2 rounded-lg' : 'text-gray-600 cursor-pointer' }`}
              onClick={() => setActiveTab('alerts')}
            >
              Alerts
            </button>
          </div>

          <div className={`tab-content ${activeTab === 'routes' ? 'block' : 'hidden'}`}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoutes.map((route) => (
                <div key={route.id} className="card p-4 bg-white shadow-lg rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Bus className="mr-2 h-5 w-5" />
                      <span className="font-semibold">{route.name}</span>
                    </div>
                    <span className={`badge ${route.status === "on-time" ? "badge-outline" : "badge-destructive"}`}>
                      {route.status === "on-time" ? "On Time" : `Delayed (${route.delay})`}
                    </span>
                  </div>
                  <div>{route.description}</div>
                  <div className="text-sm text-muted-foreground">
                    <div>Next Departure: {route.nextBus}</div>
                    <div className="mt-2">
                      <div className="font-medium">Stops:</div>
                      <div className="mt-2 space-y-2">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            {stop.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full py-2 border border-gray-200 hover:cursor-pointer  hover:bg-gray-100 rounded-md flex justify-center items-center"
                    onClick={() => subscribeToAlerts(route.name)}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Subscribe to Alerts
                  </button>
                </div>
              ))}
            </div>
          </div>


          <div className={`tab-content ${activeTab === 'map' ? 'block' : 'hidden'}`}>
            {/* Map content */}
            <div className="card p-4 bg-white shadow-lg rounded-lg ">
              <div className="font-semibold mb-2">Interactive Bus Map</div>
              <div className="relative h-[500px] bg-gray-200 rounded-md">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">Interactive map would be displayed here</span>
                </div>
              </div>
            </div>
          </div>



          <div className={`tab-content ${activeTab === 'alerts' ? 'block' : 'hidden'}`}>
            {/* Alerts */}
            <div className="card p-4 bg-white shadow-lg rounded-lg space-y-4">
              <div className="font-semibold mb-2">Recent Service Alerts</div>
              {busRoutes.map((route) => route.status === "delayed" && (
                <div key={route.id} className="alert alert-destructive p-4 bg-red-500 text-white rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="font-semibold">Delay on {route.name}</div>
                  <div>{route.name} is delayed by {route.delay} due to traffic.</div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

      <Schedule/>
    </div>
  );
};

export default BusSchedule;
