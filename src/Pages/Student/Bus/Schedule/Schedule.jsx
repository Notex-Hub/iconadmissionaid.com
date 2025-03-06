import  { useState } from "react";
import useBus from "../../../../Hooks/useBus";

const Schedule = () => {
  const [ bus ] = useBus();
  const busData=bus?.data;
  // const delaydBus = busData?.filter( d => d.status === 'Delayed');
  const [activeTab, setActiveTab] = useState("R126");

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
              {busData?.map((route) => (
                <button
                  key={route.id}
                  className={`tab-trigger w-full py-2 text-sm font-medium ${activeTab === route.route_id ? 'bg-white text-black font-semibold px-2  rounded-lg' : 'text-gray-600 cursor-pointer'}`}
                  onClick={() => setActiveTab(route.route_id)}
                >
                  {route.route_id}
                </button>
              ))}
            </div>
            {busData?.map((route) => (
              <div key={route._id} className={`tab-content ${activeTab === route.route_id ? "block" : "hidden"}`}>
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Stop</th>
                        {route.stops.map((time, i) => (
                          <th key={i} className="text-center p-2 font-medium">
                            {time?.arrival_time}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {route?.stops?.map((stop, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-medium">{stop.stop_name}</td>
                         
                            <td  className="text-center p-2">
                              {stop?.departure_time}
                            </td>
                   
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
