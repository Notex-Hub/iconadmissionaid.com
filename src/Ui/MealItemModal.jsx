/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosPublic } from "../Hooks/usePublic";

const MealItemModal = ({ item, onClose, onSave, refetchData }) => {
  const [formData, setFormData] = useState(
    item || {
      name: "",
      category: "",
      price: "",
      calories: "",
      protein: "", 
      fat: "", 
      carbs: "", 
      available: true,
      dietary: [],
      type: "breakfast", 
    }
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      const requiredFields = [
        "name",
        "category",
        "price",
        "calories",
        "type",
        "protein",
        "fat",
        "carbs",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        toast.error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        setLoading(false);
        return;
      }

      // Format data for API
      const mealData = {
        name: formData.name,
        price: parseFloat(formData.price.toString().replace("$", "")),
        category: formData.category,
        calories: parseInt(formData.calories),
        type: formData.type,
        // Add nutritional information with "g" suffix if not already present
        protein: formData.protein.endsWith("g")
          ? formData.protein
          : `${formData.protein}g`,
        fat: formData.fat.endsWith("g") ? formData.fat : `${formData.fat}g`,
        carbs: formData.carbs.endsWith("g")
          ? formData.carbs
          : `${formData.carbs}g`,
      };

      // Get current day
      const today = new Date().toLocaleString("en-us", { weekday: "long" });

      if (item) {
        // Update existing meal
        await axiosPublic.patch(`/meal/${item._id}`, mealData);
        toast.success("Meal updated successfully");
      } else {
        const data = {
          day: today,
          meal: mealData,
        };
        await axiosPublic.post(`/meal/create-meal`, data);
        toast.success("Meal added successfully");
      }

      // Refresh data
      refetchData();
      onSave(formData);
    } catch (error) {
      console.error("Error saving meal:", error);

      // Display validation errors in a more user-friendly way
      if (error.response?.data?.issues) {
        const issueMessages = error.response.data.issues.map(
          (issue) => issue.message
        );
        toast.error(`Validation failed: ${issueMessages.join(", ")}`);
      } else {
        toast.error(error.response?.data?.message || "Failed to save meal");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a string contains only a number
  const isNumeric = (str) => /^\d+$/.test(str);

  // Helper function to ensure "g" suffix for nutritional values
  const formatNutritionalValue = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // If the value is only numbers, append "g" suffix
    if (isNumeric(value)) {
      formattedValue = `${value}g`;
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-w-[95%] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">
          {item ? "Edit Menu Item" : "Add Menu Item"}
        </h2>

        <div className="space-y-4">
          {/* Basic Info Fields */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <input
              type="text"
              name="category"
              placeholder="Category (e.g., Vegan, Gluten-free)"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price ($) *
            </label>
            <input
              type="text"
              name="price"
              placeholder="Price (e.g., 5.99)"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Meal Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          {/* Nutritional Information Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-3">Nutritional Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Calories *
                </label>
                <input
                  type="number"
                  name="calories"
                  placeholder="Calories"
                  value={formData.calories}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Protein (g) *
                </label>
                <input
                  type="text"
                  name="protein"
                  placeholder="e.g., 12g"
                  value={formData.protein}
                  onChange={handleChange}
                  onBlur={formatNutritionalValue}
                  className="w-full border p-3 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Fat (g) *
                </label>
                <input
                  type="text"
                  name="fat"
                  placeholder="e.g., 8g"
                  value={formData.fat}
                  onChange={handleChange}
                  onBlur={formatNutritionalValue}
                  className="w-full border p-3 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Carbs (g) *
                </label>
                <input
                  type="text"
                  name="carbs"
                  placeholder="e.g., 35g"
                  value={formData.carbs}
                  onChange={handleChange}
                  onBlur={formatNutritionalValue}
                  className="w-full border p-3 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors flex items-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealItemModal;