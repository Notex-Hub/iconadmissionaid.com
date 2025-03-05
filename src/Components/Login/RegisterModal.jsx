/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    role: "student",
    fullName: "",
    email: "",
    password: "",
    program: "",
    yearOfStudy: "",
    department: "",
    employeeId: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    alert(`Successfully registered as ${formData.role}`);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } duration-300`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-96 transform transition-transform ${
          isOpen ? "scale-100" : "scale-90"
        } duration-300`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold">Register</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Registration Form */}
        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="canteen_staff">Canteen Staff</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Student-Specific Fields */}
          {formData.role === "student" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Program</label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your program (e.g., Computer Science)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Year of Study</label>
                <input
                  type="number"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter year of study (e.g., 2)"
                />
              </div>
            </>
          )}

          {/* Faculty-Specific Fields */}
          {formData.role === "faculty" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department (e.g., CSE)"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter employee ID"
                />
              </div>
            </>
          )}

          {/* Canteen Staff Fields */}
          {formData.role === "canteen_staff" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter staff ID"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
