import { BookOpenIcon, ClockIcon } from "lucide-react";


const scheduleData = {
  monday: [
    { time: "10:00 AM - 11:30 AM", course: "CS 101", location: "Room 302", professor: "Dr. Smith" },
    { time: "2:00 PM - 3:30 PM", course: "MATH 201", location: "Room 156", professor: "Dr. Johnson" },
  ],
  tuesday: [
    { time: "9:30 AM - 11:00 AM", course: "ENG 110", location: "Room 405", professor: "Prof. Williams" },
    { time: "1:00 PM - 2:30 PM", course: "PHYS 101", location: "Room 220", professor: "Dr. Brown" },
  ],
  wednesday: [
    { time: "10:00 AM - 11:30 AM", course: "CS 101", location: "Room 302", professor: "Dr. Smith" },
    { time: "3:30 PM - 5:00 PM", course: "CHEM 101", location: "Room 180", professor: "Dr. Davis" },
  ],
  thursday: [
    { time: "9:30 AM - 11:00 AM", course: "ENG 110", location: "Room 405", professor: "Prof. Williams" },
    { time: "2:00 PM - 3:30 PM", course: "MATH 201", location: "Room 156", professor: "Dr. Johnson" },
  ],
  friday: [
    { time: "1:00 PM - 2:30 PM", course: "PHYS 101", location: "Room 220", professor: "Dr. Brown" },
  ],
};

const WeeklySchedule = () => {
  return (
    <div className=" mx-auto">
      <div className="">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
        <p className="mt-2 text-gray-600">Your class schedule for the current semester</p>
      </div>

      <div className="space-y-6">
        {Object.entries(scheduleData).map(([day, classes]) => (
          <div key={day} className="space-y-4">
            <h3 className="font-medium text-xl text-gray-800 capitalize">{day}</h3>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                >
                  <div className="space-y-2">
                    <div className="font-semibold text-lg text-gray-900">{cls.course}</div>
                    <div className="text-sm text-gray-500">{cls.location}</div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="mr-2 h-5 w-5 text-gray-500" />
                      {cls.time}
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <BookOpenIcon className="mr-2 h-5 w-5 text-gray-500" />
                      {cls.professor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
