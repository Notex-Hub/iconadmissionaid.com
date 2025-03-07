/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";

const ActionMenu = ({
  isOpen,
  onClose,
  onEdit,
  onToggleAvailability,
  onDelete,
  isAvailable,
  loading,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 z-50 mt-1 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div className="py-1">
        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          onClick={onEdit}
          disabled={loading}
        >
          Edit
        </button>
        <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          onClick={onToggleAvailability}
          disabled={loading}
        >
          {isAvailable ? "Mark Unavailable" : "Mark Available"}
        </button>
        <button
          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 disabled:opacity-50"
          onClick={onDelete}
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ActionMenu;
