/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import RealTimeDate from "../../../../Components/RealTimeDate";
import useMeals from "../../../../Hooks/useMeals";
import { FaTrash } from "react-icons/fa6";
import { axiosPublic } from "../../../../Hooks/usePublic";
import useProfile from "../../../../Hooks/useProfile";
import StudentNavbar from "../../../StudentDashboard/StudentNavbar/StudentNavbar";
import moment from "moment";
import { FaInfoCircle, FaRegClock } from "react-icons/fa";

const CafeteriaMenu = () => {
  const { profile } = useProfile();
  const [meals] = useMeals();
  const mealsData = meals?.data;
  const [orderItems, setOrderItems] = useState([]);
  const [activeTab, setActiveTab] = useState("breakfast");
  const [todaysMeals, setTodaysMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  // Extract today's meals when meal data is loaded
  useEffect(() => {
    if (mealsData) {
      setIsLoading(true);
      const today = moment().format("dddd"); // e.g., "Monday"

      // Find today's meal data
      const todayMealData = mealsData.find((day) => day.day === today);

      if (todayMealData && todayMealData.meals) {
        // Group meals by type
        const breakfast = todayMealData.meals.filter(
          (meal) => meal.type === "breakfast"
        );
        const lunch = todayMealData.meals.filter(
          (meal) => meal.type === "lunch"
        );
        const dinner = todayMealData.meals.filter(
          (meal) => meal.type === "dinner"
        );

        setTodaysMeals({ breakfast, lunch, dinner });
      } else {
        // Reset to empty arrays if no meals found for today
        setTodaysMeals({ breakfast: [], lunch: [], dinner: [] });
      }
      setIsLoading(false);
    }
  }, [mealsData]);

  // Update total price whenever order items change
  useEffect(() => {
    const price = orderItems.reduce((total, meal) => total + meal.price, 0);
    setTotalPrice(price);
  }, [orderItems]);

  const removeItem = (indexToRemove) => {
    setOrderItems(orderItems.filter((_, index) => index !== indexToRemove));
  };

  const addToOrder = (item) => {
    setOrderItems([...orderItems, item]);
    toast.success(`Added ${item.name} to your order`);
  };

  const placeOrder = () => {
    if (orderItems.length === 0) {
      toast.error("Please add items before placing an order.");
      return;
    }

    const data = {
      user: profile?._id,
      selected_meals: orderItems,
      total_price: totalPrice,
      status: "Pending",
    };

    axiosPublic
      .post("/preOrder/craete-preOrder", data)
      .then((response) => {
        toast.success(
          "Your order has been placed and will be ready for pickup in 15 minutes."
        );
        setOrderItems([]);
      })
      .catch((error) => {
        toast.error("Failed to place order. Please try again.");
        console.error(error);
      });
  };

  // Render meal card
  const renderMealCard = (item) => (
    <div
      key={item._id}
      className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h4 className="font-semibold text-lg">{item.name}</h4>
          <p className="text-sm text-gray-500">{item.category}</p>

          {/* Nutritional information */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>Calories: {item.calories}</p>
            <div className="flex space-x-3">
              <span>Protein: {item.protein}</span>
              <span>Fat: {item.fat}</span>
              <span>Carbs: {item.carbs}</span>
            </div>
          </div>

          <p className="text-base font-semibold text-green-600 mt-2">
            ${item.price.toFixed(2)}
          </p>
        </div>

        <button
          onClick={() => addToOrder(item)}
          className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors"
        >
          Add to Order
        </button>
      </div>
    </div>
  );

  // Display message if no meals are available
  const renderEmptyMealsMessage = () => (
    <div className="col-span-2 p-8 text-center bg-gray-50 rounded-lg">
      <FaInfoCircle className="mx-auto text-gray-400 text-4xl mb-2" />
      <p className="text-gray-500">
        No {activeTab} options available for today.
      </p>
    </div>
  );

  return (
    <div>
      <StudentNavbar />
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Today&apos;s Cafeteria Menu
            </h2>
            <p className="text-gray-500 mt-1 flex items-center">
              <FaRegClock className="mr-1" /> Orders must be placed at least 30
              minutes before meal time
            </p>
          </div>
          <RealTimeDate />
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b mb-6">
          {["breakfast", "lunch", "dinner"].map((meal) => (
            <button
              key={meal}
              className={`px-6 py-3 text-lg font-semibold capitalize ${
                activeTab === meal
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(meal)}
            >
              {meal}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex lg:flex-row flex-col gap-6">
            {/* Menu Items */}
            <div className="lg:w-2/3">
              <div className="grid md:grid-cols-2 gap-4">
                {activeTab === "breakfast" &&
                  (todaysMeals.breakfast.length > 0
                    ? todaysMeals.breakfast.map(renderMealCard)
                    : renderEmptyMealsMessage())}

                {activeTab === "lunch" &&
                  (todaysMeals.lunch.length > 0
                    ? todaysMeals.lunch.map(renderMealCard)
                    : renderEmptyMealsMessage())}

                {activeTab === "dinner" &&
                  (todaysMeals.dinner.length > 0
                    ? todaysMeals.dinner.map(renderMealCard)
                    : renderEmptyMealsMessage())}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
                  Your Order
                </h3>

                {orderItems.length > 0 ? (
                  <>
                    <ul className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                      {orderItems.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center py-2 border-b"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.type}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold">
                              ${item.price.toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                              aria-label="Remove item"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-2 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total:</span>
                        <span className="text-lg font-bold">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={placeOrder}
                        className="w-full bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
                      >
                        Place Order
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-gray-500 mb-4">Your order is empty</p>
                    <p className="text-sm text-gray-400">
                      Select items from the menu to place an order
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeteriaMenu;
