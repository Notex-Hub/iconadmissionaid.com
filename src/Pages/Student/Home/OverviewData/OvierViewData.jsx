
import { Compass, MapPin } from "react-feather"; // Assuming you're using react-feather for the icons

const OvierViewData = () => {
  const schedule = [
    { day: "Monday", classes: ["CS 101 (10:00 AM)", "MATH 201 (2:00 PM)"] },
    { day: "Tuesday", classes: ["ENG 110 (9:30 AM)", "PHYS 101 (1:00 PM)"] },
    { day: "Wednesday", classes: ["CS 101 (10:00 AM)", "CHEM 101 (3:30 PM)"] },
    { day: "Thursday", classes: ["ENG 110 (9:30 AM)", "MATH 201 (2:00 PM)"] },
    { day: "Friday", classes: ["PHYS 101 (1:00 PM)"] },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      {/* Weekly Schedule Card */}
      <div className="col-span-4 card bg-base-100 shadow-xl rounded-lg p-4">
        <div className="card-header border-b border-gray-300 mb-4">
          <h2 className="card-title text-xl font-semibold text-gray-800 my-2">Weekly Class Schedule</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {schedule.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-24 font-semibold text-gray-700">{item.day}</div>
                <div className="flex-1 space-y-2">
                  {item.classes.map((cls, i) => (
                    <div key={i} className="bg-gray-100 p-2 rounded-lg shadow-sm text-sm text-gray-800">
                      {cls}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campus Map Card */}
      <div className="col-span-3 card bg-base-100 shadow-xl rounded-lg p-4">
        <div className="card-header border-b border-gray-300 mb-4 my-2">
          <h2 className="card-title text-xl font-semibold text-gray-800">Campus Map</h2>
          <p className="card-description text-sm text-gray-600">Popular locations on campus</p>
        </div>
        <div className="card-body relative">
          <div className="bg-gray-200 h-[300px] relative rounded-lg shadow-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="h-12 w-12 text-gray-500 opacity-70" />
            </div>
            <div className="absolute top-1/4 left-1/4 bg-blue-500 text-white rounded-full p-2">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="absolute top-1/2 left-1/2 bg-blue-500 text-white rounded-full p-2">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="absolute bottom-1/4 right-1/4 bg-blue-500 text-white rounded-full p-2">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvierViewData;
