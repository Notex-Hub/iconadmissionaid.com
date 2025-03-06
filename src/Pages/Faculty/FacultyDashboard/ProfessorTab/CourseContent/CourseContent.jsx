import { useState } from "react"

const initialCourses = [
  {
    _id: "67c979f08bab87a84232a78b",
    course_code: "CS101",
    course_name: "Introduction to Computer Science",
    credits: 3,
    department: "Computer Science",
    prerequisites: ["MATH101", "ENG110"]
  },
  {
    _id: "8f8c979f08bab87a84232a78c",
    course_code: "CS201",
    course_name: "Data Structures and Algorithms",
    credits: 4,
    department: "Computer Science",
    prerequisites: ["CS101"]
  },
]

export function CourseContent() {
  const [courses, setCourses] = useState(initialCourses)
  const [newCourse, setNewCourse] = useState({
    course_code: "",
    course_name: "",
    credits: 0,
    department: "",
    prerequisites: []
  })

  const handleAddCourse = () => {
    if (newCourse.course_code && newCourse.course_name && newCourse.department) {
      setCourses([...courses, { ...newCourse, _id: new Date().getTime().toString() }])
      setNewCourse({
        course_code: "",
        course_name: "",
        credits: 0,
        department: "",
        prerequisites: []
      })
    }
  }
// console.log(newCourse)
  return (
    <div className=" mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Courses</h2>
      <p className="text-lg text-gray-500 mb-6">Manage your courses and schedules</p>

      {/* New Course Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Course</h3>
        <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Course Code"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.course_code}
            onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Course Name"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.course_name}
            onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Credits"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.department}
            onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
          />
          <input
            type="text"
            placeholder="Prerequisites"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.prerequisites.join(", ")}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                prerequisites: e.target.value.split(",").map((item) => item.trim())
              })
            }
          />
          <button
            className=" p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleAddCourse}
          >
            Add Course
          </button>
        </div>
      </div>

      {/* Course Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Course Code</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Course Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Credits</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Department</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Prerequisites</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-700">{course.course_code}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{course.course_name}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{course.credits}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{course.department}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{course.prerequisites.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
