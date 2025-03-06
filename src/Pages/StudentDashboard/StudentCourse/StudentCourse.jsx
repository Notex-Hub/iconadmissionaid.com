import { useState } from "react";


const initialCourses = [
  { id: 'CS101', name: 'Introduction to Computer Science', professor: 'Dr. Smith', credits: 3 },
  { id: 'MATH201', name: 'Calculus II', professor: 'Dr. Johnson', credits: 4 },
  { id: 'ENG110', name: 'English Composition', professor: 'Prof. Williams', credits: 3 },
  { id: 'PHYS101', name: 'Physics I', professor: 'Dr. Brown', credits: 4 },
  { id: 'CHEM101', name: 'General Chemistry', professor: 'Dr. Davis', credits: 4 },
];

export function StudentCourse() {
  const [courses, setCourses] = useState(initialCourses);
  const [availableCourses, setAvailableCourses] = useState(initialCourses); // for dropdown
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isCourseRegistered, setIsCourseRegistered] = useState(false);

  const handleDropCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
    alert(`You have successfully dropped ${courseId}.`);
  };

  const handleRegisterCourse = () => {
    const courseToRegister = availableCourses.find(course => course.id === selectedCourse);
    if (courseToRegister) {
      setCourses([...courses, courseToRegister]);
      setAvailableCourses(availableCourses.filter(course => course.id !== selectedCourse));
      setIsCourseRegistered(true);
      alert(`You have successfully registered for ${courseToRegister.name}.`);
    }
  };

  return (
    <div className=" mx-auto p-4 space-y-6">

            {/* Course Registration Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Course Registration</h2>
        <p className="mb-6 text-gray-500">Select a course to register from the dropdown</p>

        <div className="space-y-4">
          <select
            className="w-full p-3 border border-gray-300 rounded-md"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a course</option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md"
            onClick={handleRegisterCourse}
            disabled={!selectedCourse}
          >
            Register
          </button>

          {isCourseRegistered && (
            <p className="text-green-500 mt-4">You have successfully registered for the course!</p>
          )}
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Enrolled Courses</h2>
        <p className="mb-6 text-gray-500">View and manage your current course enrollments</p>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Course ID</th>
                <th className="px-4 py-2 text-left">Course Name</th>
                <th className="px-4 py-2 text-left">Professor</th>
                <th className="px-4 py-2 text-left">Credits</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{course.id}</td>
                  <td className="px-4 py-2">{course.name}</td>
                  <td className="px-4 py-2">{course.professor}</td>
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
      </div>

  
    </div>
  );
}
