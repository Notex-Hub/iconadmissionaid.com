import { Bus, Watch } from 'lucide-react';
import { useState } from 'react';
import {  MapPin, Bell, AlertTriangle } from 'react-feather';
import Schedule from '../Schedule/Schedule';
import RealTimeDate from '../../../../Components/RealTimeDate';
import Navbar from "../../Home/Navbar/Navbar"
import useBus from '../../../../Hooks/useBus';


const BusSchedule = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('routes'); 
  const [ bus ] = useBus();
  const busData=bus?.data;
  const delaydBus = busData?.filter( d => d.status === 'Delayed');

  const filteredRoutes = busData?.filter(route =>
    route.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.stops.some(stop => stop.stop_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const subscribeToAlerts = (routeName) => {
    console.log(`Subscribed to alerts for ${routeName}`);
  };

  return (
 <div>
  <Navbar />
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

        {busData?.some(route => route.status === "Delayed") && (
          <div className="alert alert-destructive p-4 flex items-center space-x-2 bg-red-500 text-white rounded-md">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <div className="font-semibold">Service Disruption</div>
              {
                delaydBus?.map(delay => <div key={delay._id}> {delay?.route_name} is currently delayed by 10 minutes due to traffic.</div> )
              }
             
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
              {filteredRoutes?.map((route) => (
                <div key={route.id} className="card p-4 bg-white shadow-lg rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Bus className="mr-2 h-5 w-5" />
                      <span className="font-semibold">{route.route_name}</span>
                    </div>
                    <span className={`badge ${route.status === "On Time" ? "border border-gray-300 text-green-500" : "badge-destructive text-red-500"}`}>
                      {route.status === "On Time" ? "On Time" : `${route?.status}`}
                    </span>
                  </div>
                  <div>{route.description}</div>
                  <div className="text-sm text-muted-foreground">
                  <div className="mt-2">
                      <div className="font-medium">Next Departure Time:</div>
                      <div className="mt-2 space-y-2">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="flex items-center">
                            <Watch className="mr-2 h-4 w-4 text-muted-foreground" />
                            {stop.departure_time}
                          </div>
                        ))}
                      </div>
                    </div>
                   
                    <div className="mt-2">
                      <div className="font-medium">Stops:</div>
                      <div className="mt-2 space-y-2">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            {stop.stop_name}
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
              {busData?.map((route) => route.status === "Delayed" && (
                <div key={route.id} className="alert alert-destructive p-4 bg-red-500 text-white rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="font-semibold">Delay on {route.route_name}</div>
                  <div>{route.route_name} is delayed by {route.status} due to traffic.</div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

      <Schedule/>
    </div>
 </div>
  );
};

export default BusSchedule;
