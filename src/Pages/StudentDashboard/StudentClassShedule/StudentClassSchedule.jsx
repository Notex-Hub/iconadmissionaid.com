import { useState } from "react";


const classData = [
  {
    "_id": "67c97cec4ff89a1a4002df0e",
    "courseId": {
      "course_code": "CS101",
      "course_name": "Introduction to Computer Science",
      "credits": 3,
      "department": "Computer Science",
      "prerequisites": ["MATH101", "ENG110"]
    },
    "room": "Room 302",
    "time": "10:00 AM - 11:30 AM",
    "day": "Monday",
  },
  {
    "_id": "67c9a172b5e1867237dfb187",
    "courseId": {
      "course_code": "CS101",
      "course_name": "Introduction to Computer Science",
      "credits": 3,
      "department": "Computer Science",
      "prerequisites": ["MATH101", "ENG110"]
    },
    "room": "Room 302",
    "time": "11:00 AM - 12:30 AM",
    "day": "Tuesday",
  },
  {
    "_id": "67c9a1aeb5e1867237dfb18c",
    "courseId": {
      "course_code": "CS101",
      "course_name": "Introduction to Computer Science",
      "credits": 3,
      "department": "Computer Science",
      "prerequisites": ["MATH101", "ENG110"]
    },
    "room": "Room 302",
    "time": "08:00 AM - 09:30 AM",
    "day": "Wednesday",
  },
  {
    "_id": "67c9a1aeb5e1867237dfb18c",
    "courseId": {
      "course_code": "CS101",
      "course_name": "Introduction to Computer Science",
      "credits": 3,
      "department": "Computer Science",
      "prerequisites": ["MATH101", "ENG110"]
    },
    "room": "Room 302",
    "time": "08:00 AM - 09:30 AM",
    "day": "Wednesday",
  },
  {
    "_id": "67c9a1aeb5e1867237dfb18c",
    "courseId": {
      "course_code": "CS101",
      "course_name": "Introduction to Computer Science",
      "credits": 3,
      "department": "Computer Science",
      "prerequisites": ["MATH101", "ENG110"]
    },
    "room": "Room 302",
    "time": "08:00 AM - 09:30 AM",
    "day": "Wednesday",
  },
  // Add the rest of your class data here...
];

export function StudentClassSchedule() {
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Filter the class data based on the selected day
  const filteredClasses = classData.filter(item => item.day === selectedDay);

  return (
    <div className=" mx-auto p-4 space-y-6">
      {/* Card Component */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Class Schedule</h2>
        <p className="text-gray-500 mb-6">View your weekly class schedule</p>

        <div className="space-y-4">
          {/* Select Day Dropdown */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>

          {/* Schedule List */}
          <div className="space-y-4">
            {filteredClasses.map((item) => (
              <div key={item._id} className="rounded-lg border p-4 bg-gray-50 shadow-sm hover:shadow-md">
                <div className="font-semibold text-gray-700">{item.time}</div>
                <div className="text-lg text-gray-800">{item.courseId.course_name} ({item.courseId.course_code})</div>
                <div className="text-sm text-gray-500">Room: {item.room}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
