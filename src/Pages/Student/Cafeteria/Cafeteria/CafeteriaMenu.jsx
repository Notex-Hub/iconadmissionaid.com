import { useState } from "react";

import { toast } from "react-toastify";
import RealTimeDate from "../../../../Components/RealTimeDate";
import Navbar from "../../Home/Navbar/Navbar"
import useMeals from "../../../../Hooks/useMeals";
import { FaTrash } from "react-icons/fa6";
import { axiosPublic } from "../../../../Hooks/usePublic";
import useProfile from "../../../../Hooks/useProfile";

const CafeteriaMenu = () => {
  const { profile } = useProfile();
  // console.log(profile)
  const [ meals ] = useMeals();
  const mealsData=meals?.data;
  const [orderItems, setOrderItems] = useState([]);
  const removeItem = (indexToRemove) => {
    setOrderItems(orderItems.filter((_, index) => index !== indexToRemove));
  };
  console.log(orderItems)


  const [activeTab, setActiveTab] = useState("breakfast"); // State to track selected tab

  const addToOrder = (item) => {
    setOrderItems([...orderItems, item]);
 
  };

  // Filter Meals
  const breakFast = mealsData
  ?.flatMap(dayData => dayData?.meals) 
  ?.filter(meal => meal?.type === "breakfast"); 

  // Filter Meals
  const lunch = mealsData
  ?.flatMap(dayData => dayData?.meals) 
  ?.filter(meal => meal?.type === "lunch"); 

  // Filter Meals
  const dinner = mealsData
  ?.flatMap(dayData => dayData?.meals) 
  ?.filter(meal => meal?.type === "dinner"); 






  const placeOrder = () => {
    if (orderItems.length === 0) {
      toast.error("Please add items before placing an order.");
      return;
    } 

    const totalPrice = orderItems.reduce((total, meal) => total + meal.price, 0);

    const data = {
        user:profile?._id,
        selected_meals:orderItems,
        total_price:totalPrice,
        status:"Pending"
        


    }
    console.log(data)


      axiosPublic.post('/preOrder/craete-preOrder', data).then(response => 
        console.log(response),
        toast.success("Your order has been placed and will be ready for pickup in 15 minutes.")
      ).catch(err=> {
        console.log(err)
      })
 





  
    setOrderItems([]); 
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

    {
      activeTab === 'breakfast' && (
        <div className="grid md:grid-cols-2 gap-5 grid-cols-1">
        {breakFast?.map((item, i) => (
          <div key={i} className="p-4 border rounded-lg flex justify-between items-center mb-3">
            <div>
              <h4 className="font-semibold">{item?.name}</h4>
              <p className="text-sm text-gray-500">{item?.category}</p>
              <p className="text-sm font-semibold mt-1">${item?.price.toFixed(2)}</p>
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
      )
    }

    {
      activeTab === 'lunch' && (
        <div className="grid md:grid-cols-2 gap-5 grid-cols-1">
        {lunch?.map((item, i) => (
          <div key={i} className="p-4 border rounded-lg flex justify-between items-center mb-3">
            <div>
              <h4 className="font-semibold">{item?.name}</h4>
              <p className="text-sm text-gray-500">{item?.category}</p>
              <p className="text-sm font-semibold mt-1">${item?.price.toFixed(2)}</p>
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
      )
    }

    {
      activeTab === 'dinner' && (
        <div className="grid md:grid-cols-2 gap-5 grid-cols-1">
        {dinner?.map((item, i) => (
          <div key={i} className="p-4 border rounded-lg flex justify-between items-center mb-3">
            <div>
              <h4 className="font-semibold">{item?.name}</h4>
              <p className="text-sm text-gray-500">{item?.category}</p>
              <p className="text-sm font-semibold mt-1">${item?.price.toFixed(2)}</p>
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
      )
    }


 
    



      {/* Order Summary */}
      <div className="p-4 rounded-lg grow lg:ml-5">
      <h3 className="text-xl font-semibold mb-3">Your Order</h3>
      {orderItems.length > 0 ? (
        <ul className="space-y-2">
          {orderItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{item.name}</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </div>
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
        disabled={orderItems.length === 0}
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
