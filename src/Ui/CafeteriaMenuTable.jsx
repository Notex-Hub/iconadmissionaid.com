import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import useMeals from "../Hooks/useMeals";
import { axiosPublic } from "../Hooks/usePublic";
import { toast } from "react-toastify";
import MealItem from "./MealItam";
import MealItemModal from "./MealItemModal";

const CafeteriaMenuTable = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mealsData, refetch] = useMeals();

  // Get today's meals from API data
  useEffect(() => {
    if (mealsData?.data) {
      // Get current day name
      const today = new Date().toLocaleString("en-us", { weekday: "long" });

      // Find today's meals in the data
      const todaysMealData = mealsData.data.find((day) => day.day === today);

      if (todaysMealData && todaysMealData.meals) {
        // Transform meals data to match our component's format
        const formattedMeals = todaysMealData.meals.map((meal) => ({
          id: meal._id,
          day_id: todaysMealData._id, 
          _id: meal._id, // Keep original ID for API operations
          name: meal.name,
          category: meal.category,
          price:
            typeof meal.price === "number"
              ? `$${meal.price.toFixed(2)}`
              : meal.price,
          calories: meal.calories,
          available: meal.available ?? true,
          dietary: [meal.category],
          type: meal.type,
        }));

        setMenuItems(formattedMeals);
      }
    }
  }, [mealsData]);

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

  // Handle item deletion
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      return;
    }

    try {
      // Call API to delete meal
      await axiosPublic.delete(`/meal/${item._id}`);

      // Update local state
      setMenuItems(menuItems.filter((i) => i.id !== item.id));

      // Show success message
      toast.success("Item deleted successfully");

      // Refresh data
      refetch();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  // Handle item save (add/edit)
  const handleSave = (item) => {
    if (selectedItem) {
      // Update existing item
      setMenuItems(
        menuItems.map((i) =>
          i.id === selectedItem.id ? { ...item, id: selectedItem.id } : i
        )
      );
    } else {
      // Add new item
      setMenuItems([...menuItems, { ...item, id: `TEMP_${Date.now()}` }]);
    }

    setModalOpen(false);
  };

  // Group meals by type (breakfast, lunch, dinner)
  const groupedMeals = {
    breakfast: menuItems.filter((item) => item.type === "breakfast"),
    lunch: menuItems.filter((item) => item.type === "lunch"),
    dinner: menuItems.filter((item) => item.type === "dinner"),
  };

  return (
    <div className="w-full p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">
          Today&apos;s Menu -{" "}
          {new Date().toLocaleDateString("en-US", { weekday: "long" })}
        </div>
        <button
          className="px-3 py-2 text-sm border rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
          onClick={openAddModal}
        >
          <FaPlus /> Add Item
        </button>
      </div>

      {["breakfast", "lunch", "dinner"].map((mealType) => (
        <div key={mealType} className="mb-6 relative">
          <h3 className="text-lg font-medium capitalize mb-3">{mealType}</h3>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Calories</th>
                  <th className="p-2 text-left">Dietary</th>
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
                      No {mealType} items available for today
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

export default CafeteriaMenuTable;