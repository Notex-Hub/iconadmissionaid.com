import { useState } from "react"


const studentsData = [
  {
    student_id: "S123456",
    name: "John Doe",
    gmail: "johndoe@example.com",
    contact: "01234567890",
    address: "123 Main Street, Dhaka, Bangladesh",
    program: "Computer Science",
    year_of_study: 2,
    semester: "Spring 2025",
    gpa: 3.75,
  },
  {
    student_id: "S123457",
    name: "Jane Smith",
    gmail: "janesmith@example.com",
    contact: "09876543210",
    address: "456 High Street, Chittagong, Bangladesh",
    program: "Software Engineering",
    year_of_study: 3,
    semester: "Fall 2024",
    gpa: 3.85,
  },
  {
    student_id: "S123458",
    name: "Alice Johnson",
    gmail: "alicej@example.com",
    contact: "01722334455",
    address: "789 College Road, Khulna, Bangladesh",
    program: "Data Science",
    year_of_study: 1,
    semester: "Summer 2025",
    gpa: 3.65,
  },
  {
    student_id: "S123459",
    name: "Bob Brown",
    gmail: "bobb@example.com",
    contact: "01655667788",
    address: "101 University Ave, Sylhet, Bangladesh",
    program: "AI & Machine Learning",
    year_of_study: 4,
    semester: "Winter 2024",
    gpa: 3.90,
  },
]

export function StudentContent() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = studentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.includes(searchTerm) ||
      student.gmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Student List</h2>

      {/* 🔍 Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by name, ID, email, or program..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 📝 Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">Student ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Program</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">Semester</th>
              <th className="p-3 text-left">CGPA</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student.student_id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="p-3 border">{student.student_id}</td>
                  <td className="p-3 border">{student.name}</td>
                  <td className="p-3 border">{student.gmail}</td>
                  <td className="p-3 border">{student.contact}</td>
                  <td className="p-3 border">{student.program}</td>
                  <td className="p-3 border">{student.year_of_study}</td>
                  <td className="p-3 border">{student.semester}</td>
                  <td className="p-3 border">{student.gpa}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center border text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
