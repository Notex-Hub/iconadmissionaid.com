/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import useCourse from "../../../Hooks/useCourse";
import { toast } from "react-toastify";

export function StudentCourse() {
  // Get courses from API
  const [courseData, refetch] = useCourse();

  // States for enrolled and available courses
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseRegistered, setIsCourseRegistered] = useState(false);

  // Process courses when API data arrives
  useEffect(() => {
    if (courseData?.data) {
      // Transform API data to the format we need
      const formattedCourses = courseData.data.map((course) => ({
        id: course._id,
        code: course.course_code,
        name: course.course_name,
        department: course.department,
        credits: course.credits,
        professor: "TBD", // Professor data might need to come from another API
        prerequisites: course.prerequisites,
      }));

      // Initially, all courses are available and none are enrolled
      setAvailableCourses(formattedCourses);
      setIsLoading(false);
    }
  }, [courseData]);

  // Handle dropping a course
  const handleDropCourse = (courseId) => {
    const courseToRemove = enrolledCourses.find(
      (course) => course.id === courseId
    );

    if (courseToRemove) {
      // Remove from enrolled courses
      setEnrolledCourses(
        enrolledCourses.filter((course) => course.id !== courseId)
      );

      // Add back to available courses
      setAvailableCourses([...availableCourses, courseToRemove]);

      toast.success(`You have successfully dropped ${courseToRemove.name}`);
    }
  };

  // Handle registering for a course
  const handleRegisterCourse = () => {
    if (!selectedCourse) {
      toast.warning("Please select a course first");
      return;
    }

    const courseToRegister = availableCourses.find(
      (course) => course.id === selectedCourse
    );

    if (courseToRegister) {
      // Add to enrolled courses
      setEnrolledCourses([...enrolledCourses, courseToRegister]);

      // Remove from available courses
      setAvailableCourses(
        availableCourses.filter((course) => course.id !== selectedCourse)
      );

      setIsCourseRegistered(true);
      setSelectedCourse("");

      toast.success(
        `You have successfully registered for ${courseToRegister.name}`
      );

      // Reset the success message after 3 seconds
      setTimeout(() => {
        setIsCourseRegistered(false);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 space-y-6">
      {/* Course Registration Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Course Registration</h2>
        <p className="mb-6 text-gray-500">
          Select a course to register from the dropdown
        </p>

        <div className="space-y-4">
          <select
            className="w-full p-3 border border-gray-300 rounded-md"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a course</option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>

          {selectedCourse && (
            <div className="p-4 border rounded-lg bg-gray-50">
              {availableCourses.find((c) => c.id === selectedCourse) && (
                <>
                  <h4 className="font-medium">
                    {availableCourses.find((c) => c.id === selectedCourse).name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Department:{" "}
                    {
                      availableCourses.find((c) => c.id === selectedCourse)
                        .department
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    Credits:{" "}
                    {
                      availableCourses.find((c) => c.id === selectedCourse)
                        .credits
                    }
                  </p>
                  {availableCourses.find((c) => c.id === selectedCourse)
                    .prerequisites?.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Prerequisites:{" "}
                      {availableCourses
                        .find((c) => c.id === selectedCourse)
                        .prerequisites.join(", ")}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleRegisterCourse}
            disabled={!selectedCourse}
          >
            Register
          </button>

          {isCourseRegistered && (
            <p className="text-green-500 mt-4">
              You have successfully registered for the course!
            </p>
          )}
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Enrolled Courses</h2>
        <p className="mb-6 text-gray-500">
          View and manage your current course enrollments
        </p>

        {enrolledCourses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Course Code</th>
                  <th className="px-4 py-2 text-left">Course Name</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Credits</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map((course) => (
                  <tr key={course.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{course.code}</td>
                    <td className="px-4 py-2">{course.name}</td>
                    <td className="px-4 py-2">{course.department}</td>
                    <td className="px-4 py-2">{course.credits}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                        onClick={() => handleDropCourse(course.id)}
                      >
                        Drop
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            You haven&apos;t enrolled in any courses yet. Register for courses above.
          </div>
        )}
      </div>
    </div>
  );
}
