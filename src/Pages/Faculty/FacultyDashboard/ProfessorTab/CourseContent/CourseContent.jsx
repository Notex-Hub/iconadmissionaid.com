import { useState } from "react";
import useCourse from "../../../../../Hooks/useCourse";
import { axiosPublic } from "../../../../../Hooks/usePublic";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";




export function CourseContent() {
  const [course, refetch] = useCourse();
  const courseData = course?.data;

  const [newCourse, setNewCourse] = useState({
    course_code: "",
    course_name: "",
    credits: Number(0),
    department: "",
    prerequisites: []
  });

  

  const handleAddCourse = () => {
    console.log(newCourse)
     // Make an API call to add the course to the server
     axiosPublic.post('/course/create-course', { ...newCourse }).then(response => {
      console.log(response);
      toast('Course Added Successfully');
      setNewCourse({
        course_code: "",
        course_name: "",
        credits: 0,
        department: "",
        prerequisites: [],
      });
      refetch();
    }).catch(err => {
      console.log(err);
      toast.error("Failed to add course");
    });
  };

  const handleOnclick = () => {

  }


 

  return (
    <div className=" mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Courses</h2>
      <p className="text-lg text-gray-500 mb-6">Manage your courses and schedules</p>

      {/* New Course Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Course</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <input
            type="text"
            required
            placeholder="Course Code"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.course_code}
            onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })}
          />
          <input
            type="text"
            required
            placeholder="Course Name"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.course_name}
            onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
          />
          <input
            type="number"
            required
            placeholder="Credits"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits:Number( e.target.value) })}
          />
          <input
            type="text"
            required
            placeholder="Department"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.department}
            onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
          />
          <input
            type="text"
            placeholder="Prerequisites"
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newCourse.prerequisites.join(", ")}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                prerequisites: e.target.value.split(",").map((item) => item.trim())
              })
            }
          />
          <div className="flex gap-4">
            <button
              className=" p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleAddCourse}
            >
              Add Course
            </button>
         
          </div>
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
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {courseData?.map((course) => (
              <tr key={course._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-700">{course.course_code}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{course.course_name}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{course.credits}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{course.department}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{course.prerequisites.join(", ")}</td>
                <td onClick={handleOnclick} className="px-4 py-4 text-sm text-gray-700"><MdDelete/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
