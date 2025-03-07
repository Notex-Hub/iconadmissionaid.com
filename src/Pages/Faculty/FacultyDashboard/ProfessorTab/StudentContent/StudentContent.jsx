import { useState } from "react"
import useStudent from "../../../../../Hooks/useStudent";
import { MdDeleteOutline } from "react-icons/md";
import { axiosPublic } from "../../../../../Hooks/usePublic";
import { toast } from "react-toastify";



export function StudentContent() {
  const [ student,refetch ] = useStudent();
  const userData=student?.data;
  const studentData = userData?.filter( x => x?.role === 'student')


  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = studentData?.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.includes(searchTerm) ||
      student.gmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const handleDelete = (_id) => {
      axiosPublic.delete(`/student/${_id}`).then(res => {
        toast.success('Student Delete Sucess')
        refetch();

      })
  }

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
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents?.length > 0 ? (
              filteredStudents?.map((student, index) => (
                <tr key={student.student_id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="p-3 border">{student._id}</td>
                  <td className="p-3 border">{student.name}</td>
                  <td className="p-3 border">{student.gmail}</td>
                  <td className="p-3 border">{student.contact}</td>
                  <td className="p-3 border">{student.program}</td>
                  <td className="p-3 border">{student.year_of_study}</td>
                  <td className="p-3 border">{student.semester}</td>
                  <td className="p-3 border">{student?.academic_info?.current_gpa}</td>
                  <td onClick={() => handleDelete(student?._id)} className="p-3  text-red-500 font-bold cursor-pointer border"><MdDeleteOutline/></td>
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
