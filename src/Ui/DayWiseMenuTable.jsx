/* eslint-disable no-unused-vars */
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import useMeals from "../Hooks/useMeals";
import { axiosPublic } from "../Hooks/usePublic";
import MealItem from "./MealItam";
import MealItemModal from "./MealItemModal";

const DayWiseMenuTable = () => {
  const [mealsData, refetch] = useMeals();
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleString("en-us", { weekday: "long" })
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Open modal for adding a new item
  const openAddModal = () => {
    setSelectedItem(null);
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

  // Get meals for the selected day
  const getDayMeals = () => {
    if (!mealsData?.data) return [];

    const dayData = mealsData.data.find((day) => day.day === selectedDay);

    if (!dayData || !dayData.meals) return [];

    return dayData.meals.map((meal) => ({
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
      available: meal.available ?? true,
      dietary: [meal.category],
      type: meal.type,
    }));
  };

  // Group meals by type (breakfast, lunch, dinner)
  const meals = getDayMeals();
  const groupedMeals = {
    breakfast: meals.filter((item) => item.type === "breakfast"),
    lunch: meals.filter((item) => item.type === "lunch"),
    dinner: meals.filter((item) => item.type === "dinner"),
  };

  return (
    <div className="space-y-6">
      {/* Day selector */}
      <div className="flex space-x-2 overflow-x-auto py-2">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              selectedDay === day
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{selectedDay}&apos;s Menu</h3>
        <button
          className="px-3 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
          onClick={openAddModal}
        >
          <FaPlus /> Add Menu Item
        </button>
      </div>

      {/* Meal type sections */}
      {["breakfast", "lunch", "dinner"].map((mealType) => (
        <div key={mealType} className="mb-6">
          <h4 className="text-lg font-medium capitalize mb-3">{mealType}</h4>

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
                {groupedMeals[mealType].length > 0 ? (
                  groupedMeals[mealType].map((item) => (
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
                      No {mealType} items for {selectedDay}
                      <button
                        className="text-blue-500 ml-2 hover:underline"
                        onClick={() => {
                          setSelectedItem({ type: mealType });
                          setModalOpen(true);
                        }}
                      >
                        Add one
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

export default DayWiseMenuTable;