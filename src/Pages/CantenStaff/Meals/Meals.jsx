import { useState, useEffect } from "react";
import useMeals from "../../../Hooks/useMeals";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { axiosPublic } from "../../../Hooks/usePublic";
import MealItemModal from "../../../Ui/MealItemModal";
import CantenStaffNavbar from "../CantenStaffNavbar/CantenStaffNavbar";

const Meals = () => {
  const [mealsData, refetch] = useMeals();
  const [allMeals, setAllMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Extract and format all meals when data is loaded
  useEffect(() => {
    if (mealsData?.data) {
      const meals = mealsData.data.flatMap((day) =>
        (day.meals || []).map((meal) => ({
          ...meal,
          day: day.day, // Add day information
          dayId: day._id, // Add day ID for API operations
        }))
      );
      setAllMeals(meals);
      setIsLoading(false);
    }
  }, [mealsData]);

  // Filtered meals based on search and filter
  const filteredMeals = allMeals.filter((meal) => {
    const matchesSearch =
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.day.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    return matchesSearch && meal.type === filter;
  });

  // Handle meal deletion
  const handleDelete = async (meal) => {
    if (window.confirm(`Are you sure you want to delete ${meal.name}?`)) {
      try {
        await axiosPublic.delete(`/meal/${meal._id}`);
        toast.success(`${meal.name} deleted successfully`);
        refetch();
      } catch (error) {
        console.error("Error deleting meal:", error);
        toast.error(error.response?.data?.message || "Failed to delete meal");
      }
    }
  };

  // Toggle availability status
  const toggleAvailability = async (meal) => {
    try {
      await axiosPublic.patch(`/meal/${meal._id}`, {
        available: !meal.available,
      });
      toast.success(
        `${meal.name} is now ${!meal.available ? "available" : "unavailable"}`
      );
      refetch();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Handle modal save
  const handleSave = () => {
    setModalOpen(false);
    refetch();
  };

  return (
    <div className="container mx-auto p-4">
    <CantenStaffNavbar />
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">All Meals</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search meals..."
                className="border rounded-md px-3 py-2 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="border rounded-md px-3 py-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => {
                setSelectedMeal(null);
                setModalOpen(true);
              }}
            >
              Add New Meal
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading meals...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Day
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nutritional Info
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMeals.length > 0 ? (
                  filteredMeals.map((meal) => (
                    <tr key={meal._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {meal.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {meal.day}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            meal.type === "breakfast"
                              ? "bg-yellow-100 text-yellow-800"
                              : meal.type === "lunch"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {meal.type.charAt(0).toUpperCase() +
                            meal.type.slice(1)}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {meal.category}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        $
                        {typeof meal.price === "number"
                          ? meal.price.toFixed(2)
                          : meal.price}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          <div>Calories: {meal.calories}</div>
                          <div>Protein: {meal.protein}</div>
                          <div>Fat: {meal.fat}</div>
                          <div>Carbs: {meal.carbs}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            meal.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {meal.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleAvailability(meal)}
                            className={`p-1 rounded-full ${
                              meal.available
                                ? "text-red-600 hover:bg-red-100"
                                : "text-green-600 hover:bg-green-100"
                            }`}
                            title={
                              meal.available
                                ? "Mark as unavailable"
                                : "Mark as available"
                            }
                          >
                            {meal.available ? <FaTimes /> : <FaCheck />}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMeal(meal);
                              setModalOpen(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                            title="Edit meal"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(meal)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                            title="Delete meal"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No meals found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <MealItemModal
          item={selectedMeal}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          refetchData={refetch}
        />
      )}
    </div>
    </div>
  );
};

export default Meals;
