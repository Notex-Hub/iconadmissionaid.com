/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { toast } from "react-toastify";
import ActionMenu from "./ActionMenu";
import { axiosPublic } from "../Hooks/usePublic";

const MealItem = ({ item, onEdit, onDelete, refetchData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleAvailability = async () => {
    try {
      setLoading(true);

      // Call API to update availability
      await axiosPublic.patch(`/meal/${item._id}`, {
        available: !item.available,
      });

      // Show success message
      toast.success(
        `Item marked as ${item.available ? "unavailable" : "available"}`
      );

      // Close menu and refresh data
      setIsMenuOpen(false);
      refetchData();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-t hover:bg-gray-100">
      <td className="p-2 font-medium">{item.name}</td>
      <td className="p-2">{item.category}</td>
      <td className="p-2">{item.price}</td>
      <td className="p-2">{item.calories}</td>
      <td className="p-2">
        {item.dietary && item.dietary.length > 0 ? (
          item.dietary.map((diet, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-200 rounded-md mr-1"
            >
              {diet}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-500">None</span>
        )}
      </td>
      <td className="p-2">
        <span
          className={`px-2 py-1 text-xs rounded-md ${
            item.available
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {item.available ? "Available" : "Unavailable"}
        </span>
      </td>

      <td className="p-2 text-right ">
        <button
          className="p-1 rounded-md hover:bg-gray-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={loading}
        >
          <FaEllipsisV />
        </button>

        <ActionMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onEdit={() => {
            setIsMenuOpen(false);
            onEdit(item);
          }}
          onToggleAvailability={toggleAvailability}
          onDelete={() => {
            setIsMenuOpen(false);
            onDelete(item);
          }}
          isAvailable={item.available}
          loading={loading}
        />
      </td>
    </tr>
  );
};

export default MealItem;