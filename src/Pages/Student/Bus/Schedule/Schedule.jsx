import  { useState } from "react";

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
      { name: "Main Campus", times: ["8:10 AM", "10:10 AM", "12:10 PM", "2:10 PM", "4:10 PM", "6:10 PM"] },
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
      { name: "Residence Hall B", times: ["8:25 AM", "10:25 AM", "12:25 PM", "2:25 PM", "4:25 PM", "6:25 PM"] },
      { name: "Residence Hall C", times: ["8:30 AM", "10:30 AM", "12:30 PM", "2:30 PM", "4:30 PM", "6:30 PM"] },
      { name: "Main Campus", times: ["8:40 AM", "10:40 AM", "12:40 PM", "2:40 PM", "4:40 PM", "6:40 PM"] },
    ],
    status: "on-time",
    nextBus: "10:15 AM",
  },
];

const Schedule = () => {
  const [activeTab, setActiveTab] = useState("route-a");

  return (
    <div className="my-5 mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4">
          <h2 className="text-xl font-semibold">Schedule Details</h2>
          <p className="text-sm text-gray-500">Complete timetable for all routes</p>
        </div>
        <div className="p-4">
          <div className="tabs">
            <div className="w-96 flex  bg-gray-100  overflow-hidden px-5  py-1 rounded-md">
              {busRoutes.map((route) => (
                <button
                  key={route.id}
                  className={`tab-trigger w-full py-2 text-sm font-medium ${activeTab === route.id ? 'bg-white text-black font-semibold px-2  rounded-lg' : 'text-gray-600 cursor-pointer'}`}
                  onClick={() => setActiveTab(route.id)}
                >
                  {route.name}
                </button>
              ))}
            </div>
            {busRoutes.map((route) => (
              <div key={route.id} className={`tab-content ${activeTab === route.id ? "block" : "hidden"}`}>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Stop</th>
                        {route.stops[0].times.map((time, i) => (
                          <th key={i} className="text-center p-2 font-medium">
                            {time}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {route.stops.map((stop, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-medium">{stop.name}</td>
                          {stop.times.map((time, i) => (
                            <td key={i} className="text-center p-2">
                              {time}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
