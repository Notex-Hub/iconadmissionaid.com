/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import StudentRegisterModal from "./StudentRegisterModal";

const RegisterModal = ({ isOpen, onClose,setIsRegisterOpen }) => {
  const [formData, setFormData] = useState({
    role: "student",
  
  });
 

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } duration-300`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg  transform transition-transform ${
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
        <div className="mt-4">
          {/* Role Selection */}
          <div className="mb-4 px-5">
            <label className="block text-sm font-medium text-gray-700">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border-none bg-gray-100  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="canteen_staff">Canteen Staff</option>
            </select>
          </div>

        
          {/* Student-Specific Fields */}
          {formData.role === "student" && (
            <div className="max-w-7xl mx-auto ">
             <StudentRegisterModal isOpen={isOpen} setIsRegisterOpen={setIsRegisterOpen} />
            </div>
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

       
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
