/* eslint-disable react/prop-types */

import { FaTimes } from "react-icons/fa";

const LoginModal = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } duration-300`}
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className={`bg-white p-6 rounded-lg shadow-lg w-96 transform transition-transform ${
          isOpen ? "scale-100" : "scale-95"
        } duration-300`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">Login</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

      
      </div>
    </div>
  );
};

export default LoginModal;
