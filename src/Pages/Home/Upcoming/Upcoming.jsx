const Upcoming = () => {
    const eventsData = [
      {
        date: "Tomorrow",
        events: [
          { time: "1:00 PM - 4:00 PM", title: "Career Fair", location: "Student Center" },
          { time: "6:00 PM - 8:00 PM", title: "Chess Club Meeting", location: "Commons Room 3" },
        ],
      },
      {
        date: "Wednesday",
        events: [{ time: "5:00 PM - 6:30 PM", title: "Guest Lecture: AI Ethics", location: "Auditorium" }],
      },
      {
        date: "Friday",
        events: [
          { time: "7:00 PM - 10:00 PM", title: "Movie Night", location: "Quad" },
          { time: "3:00 PM - 5:00 PM", title: "Research Symposium", location: "Science Building" },
        ],
      },
      {
        date: "Saturday",
        events: [{ time: "1:00 PM - 4:00 PM", title: "Basketball Game", location: "Sports Center" }],
      },
    ];
  
    const assignmentsData = [
      {
        course: "CS 101",
        assignments: [
          { title: "Programming Assignment 3", due: "Tomorrow, 11:59 PM" },
          { title: "Quiz 4", due: "Friday, 5:00 PM" },
        ],
      },
      {
        course: "MATH 201",
        assignments: [
          { title: "Problem Set 5", due: "Thursday, 11:59 PM" },
          { title: "Midterm Exam", due: "Next Monday, 2:00 PM" },
        ],
      },
      {
        course: "ENG 110",
        assignments: [
          { title: "Essay Draft", due: "Wednesday, 11:59 PM" },
          { title: "Final Paper", due: "Next Friday, 11:59 PM" },
        ],
      },
    ];
  
    return (
      <div className="space-y-6 p-4  mx-auto">
        <div className="rounded-xl p-6 shadow-lg bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <p className="text-sm text-gray-500">Events happening in the next 7 days</p>
          <div className="mt-4 space-y-6">
            {eventsData.map((day, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg text-gray-700">{day.date}</h3>
                <div className="mt-2 space-y-4">
                  {day.events.map((event, i) => (
                    <div key={i} className="rounded-xl p-4 shadow-md bg-gray-50">
                      <div className="font-medium text-gray-900 text-lg">{event.title}</div>
                      <div className="text-sm text-gray-600">{event.time}</div>
                      <div className="text-sm text-gray-600">{event.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="rounded-xl p-6 shadow-lg bg-white">
          <h2 className="text-2xl font-bold text-gray-800">Assignment Deadlines</h2>
          <p className="text-sm text-gray-500">Upcoming assignments due in the next 14 days</p>
          <div className="mt-4 space-y-6">
            {assignmentsData.map((course, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg text-gray-700">{course.course}</h3>
                <div className="mt-2 space-y-4">
                  {course.assignments.map((assignment, i) => (
                    <div key={i} className="flex justify-between items-center rounded-xl p-4 shadow-md bg-gray-50">
                      <div className="font-medium text-gray-900 text-lg">{assignment.title}</div>
                      <div className="text-sm text-gray-600">{assignment.due}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Upcoming;
  