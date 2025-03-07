/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import useMeals from "../Hooks/useMeals";
import MealItem from "./MealItam";
import MealItemModal from "./MealItemModal";
import { axiosPublic } from "../Hooks/usePublic";

const MealTypeTable = ({ mealType }) => {
  const [mealsData, refetch] = useMeals();
  const [mealsByDay, setMealsByDay] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get days of week in proper order
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    if (mealsData?.data) {
      const allDaysMeals = {};

      // Process each day's data
      daysOfWeek.forEach((day) => {
        const dayData = mealsData.data.find((d) => d.day === day);
        if (dayData && dayData.meals) {
          // Filter for the selected meal type and transform
          const filteredMeals = dayData.meals
            .filter((meal) => meal.type === mealType.toLowerCase())
            .map((meal) => ({
              id: meal._id,
              day_id: dayData._id,
              _id: meal._id,
              name: meal.name,
              category: meal.category,
              price:
                typeof meal.price === "number"
                  ? `$${meal.price.toFixed(2)}`
                  : meal.price,
              calories: meal.calories,
              protein: meal.protein,
              fat: meal.fat,
              carbs: meal.carbs,
              day: day, // Add day info
              available: meal.available ?? true,
              dietary: [meal.category],
              type: meal.type,
            }));

          allDaysMeals[day] = filteredMeals;
        } else {
          allDaysMeals[day] = [];
        }
      });

      setMealsByDay(allDaysMeals);
    }
  }, [mealsData, mealType, daysOfWeek]);

  // Open modal for adding a new item
  const openAddModal = (day) => {
    setSelectedItem({ type: mealType.toLowerCase(), day: day });
    setModalOpen(true);
  };

  // Open modal for editing an existing item
  const openEditModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Handle save (will refresh data through the refetch)
  const handleSave = () => {
    setModalOpen(false);
    refetch();
  };

  // Handle item deletion
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      return;
    }

    try {
      setLoading(true);
      // Call API to delete meal
      await axiosPublic.delete(`/meal/${item._id}`);

      // Show success message
      toast.success(`${item.name} deleted successfully`);

      // Refresh data
      refetch();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium capitalize">
          {mealType} Menu (All Days)
        </h3>
        <button
          className="px-3 py-2 text-sm border rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
          onClick={() =>
            openAddModal(
              new Date().toLocaleString("en-us", { weekday: "long" })
            )
          }
          disabled={loading}
        >
          <FaPlus /> Add {mealType} Item
        </button>
      </div>

      {/* Show tables for each day of the week */}
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">{day}</h4>
            <button
              className="px-2 py-1 text-xs border rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
              onClick={() => openAddModal(day)}
              disabled={loading}
            >
              <FaPlus size={10} /> Add {mealType} for {day}
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Calories</th>
                  <th className="p-2 text-left">Nutritional</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mealsByDay[day] && mealsByDay[day].length > 0 ? (
                  mealsByDay[day].map((item) => (
                    <MealItem
                      key={item.id}
                      item={item}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      refetchData={refetch}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No {mealType} items for {day}.
                      <button
                        className="text-blue-500 ml-2 hover:underline"
                        onClick={() => openAddModal(day)}
                      >
                        Add one now
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {modalOpen && (
        <MealItemModal
          item={selectedItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          refetchData={refetch}
        />
      )}
    </div>
  );
};

export default MealTypeTable;