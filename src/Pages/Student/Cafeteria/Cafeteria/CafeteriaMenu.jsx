import { useState } from "react";

import { toast } from "react-toastify";
import RealTimeDate from "../../../../Components/RealTimeDate";
import Navbar from "../../Home/Navbar/Navbar"

const CafeteriaMenu = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [activeTab, setActiveTab] = useState("breakfast"); // State to track selected tab

  const addToOrder = (item) => {
    setOrderItems([...orderItems, item]);
    toast.success(`${item.name} has been added to your order.`);
  };

  const placeOrder = () => {
    if (orderItems.length === 0) {
      toast.error("Please add items before placing an order.");
      return;
    }
    toast.success("Your order has been placed and will be ready for pickup in 15 minutes.");
    setOrderItems([]); // Clear order after placing
  };

  const mealData = {
    breakfast: [
      { id: 1, name: "Pancakes with Maple Syrup", price: 5.99, description: "Fluffy pancakes served with maple syrup and butter" },
      { id: 2, name: "Egg & Cheese Sandwich", price: 4.5, description: "Scrambled eggs and cheddar cheese on a toasted English muffin" },
      { id: 3, name: "Fruit Bowl", price: 3.99, description: "Fresh seasonal fruits" },
      { id: 4, name: "Yogurt Parfait", price: 4.25, description: "Greek yogurt with granola and berries" },
    ],
    lunch: [
      { id: 5, name: "Pasta Bar", price: 8.99, description: "Build your own pasta with choice of sauce and toppings" },
      { id: 6, name: "Grilled Chicken Sandwich", price: 7.5, description: "Grilled chicken breast with lettuce, tomato, and mayo on a brioche bun" },
      { id: 7, name: "Vegetarian Wrap", price: 6.99, description: "Hummus, roasted vegetables, and feta cheese in a whole wheat wrap" },
      { id: 8, name: "Caesar Salad", price: 6.5, description: "Romaine lettuce, croutons, parmesan cheese, and Caesar dressing" },
    ],
    dinner: [
      { id: 9, name: "Stir Fry Station", price: 9.99, description: "Custom stir fry with choice of protein, vegetables, and sauce" },
      { id: 10, name: "Pizza", price: 6.5, description: "Cheese or pepperoni pizza slice" },
      { id: 11, name: "Salad Bar", price: 5.99, description: "Build your own salad with fresh vegetables and toppings" },
      { id: 12, name: "Grilled Salmon", price: 11.99, description: "Grilled salmon with roasted vegetables and rice" },
    ],
  };

  return (
  <div>
    <Navbar />
      <div className="container  mx-auto p-6">
      {/* Header */}

    <div className="flex flex-col md:flex-row md:justify-between items-center  gap-2">
    <h2 className="text-3xl font-bold tracking-tight">Cafeteria</h2>
    <RealTimeDate/>
    </div>
  

      {/* Tabs Navigation */}
      <div className="flex border-b mb-6">
        {["breakfast", "lunch", "dinner"].map((meal) => (
          <button
            key={meal}
            className={`px-4 py-2 text-lg font-semibold capitalize ${
              activeTab === meal ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab(meal)}
          >
            {meal}
          </button>
        ))}
      </div>

   <div className="flex lg:flex-row flex-col ">
       {/* Menu Items for Selected Tab */}
       <div className="grid md:grid-cols-2 gap-5 grid-cols-1">
        {mealData[activeTab].map((item) => (
          <div key={item.id} className="p-4 border rounded-lg flex justify-between items-center mb-3">
            <div>
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => addToOrder(item)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className=" p-4 border rounded-lg grow lg:ml-5">
        <h3 className="text-xl font-semibold mb-3">Your Order</h3>
        {orderItems.length > 0 ? (
          <ul className="space-y-2">
            {orderItems.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.name}</span>
                <span className="font-semibold">${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Your order is empty.</p>
        )}

        {/* Place Order Button */}
        <button
          onClick={placeOrder}
          className="w-full mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Place Order
        </button>
      </div>
   </div>
    </div>
  </div>
  );
};

export default CafeteriaMenu;
