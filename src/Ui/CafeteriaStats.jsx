/* eslint-disable react-hooks/exhaustive-deps */
import { FaUtensils, FaShoppingCart, FaCoffee, FaUsers } from "react-icons/fa"; // Using react-icons for icons
import useMeals from "../Hooks/useMeals";
import useOrder from "../Hooks/useOrder";
import { useEffect, useState } from "react";

const CafeteriaStats = () => {
  const [mealsData] = useMeals();
  const [ordersData] = useOrder();
  const [stats, setStats] = useState([
    {
      title: "Total Menu Items",
      value: "Loading...",
      change: "Calculating...",
      icon: <FaUtensils className="h-5 w-5 text-gray-500" />,
    },
    {
      title: "Orders",
      value: "Loading...",
      change: "Calculating...",
      icon: <FaShoppingCart className="h-5 w-5 text-gray-500" />,
    },
    {
      title: "Active Meal Plans",
      value: "Loading...",
      change: "Calculating...",
      icon: <FaCoffee className="h-5 w-5 text-gray-500" />,
    },
    {
      title: "Dietary Restrictions",
      value: "Loading...",
      change: "Calculating...",
      icon: <FaUsers className="h-5 w-5 text-gray-500" />,
    },
  ]);

  useEffect(() => {
    if (mealsData?.data && ordersData?.data) {
      calculateStats();
    }
  }, [mealsData, ordersData]);

  const calculateStats = () => {
    // 1. Calculate total menu items
    const allMeals = mealsData.data.flatMap((day) => day.meals || []);
    const totalMenuItems = allMeals.length;

    // Calculate new items added in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newItemsThisWeek = allMeals.filter((meal) => {
      // If you have createdAt in your meal data, use it
      // Otherwise, this is an approximation
      return (
        meal._id &&
        new Date(parseInt(meal._id.substring(0, 8), 16) * 1000) > oneWeekAgo
      );
    }).length;

    // 2. Calculate orders stats
    const totalOrders = ordersData?.data?.length || 0;

    // Filter orders from last week
    const lastWeekOrders =
      ordersData?.data?.filter((order) => {
        const orderDate = order.createdAt ? new Date(order.createdAt) : null;
        return orderDate && orderDate > oneWeekAgo;
      }).length || 0;

    const orderPercentChange =
      totalOrders > 0
        ? `+${((lastWeekOrders / totalOrders) * 100).toFixed(1)}% this week`
        : "No previous orders";

    // 3. Get active meal plans (based on unique users with orders)
    const uniqueUsers = new Set();
    ordersData?.data?.forEach((order) => {
      if (order.user) {
        uniqueUsers.add(order.user);
      }
    });

    const activeMealPlans = uniqueUsers.size;

    // 4. Calculate dietary restrictions
    const dietaryCategories = {};
    allMeals.forEach((meal) => {
      if (meal.category) {
        dietaryCategories[meal.category] =
          (dietaryCategories[meal.category] || 0) + 1;
      }
    });

    const topDietaryRestrictions = Object.keys(dietaryCategories)
      .sort((a, b) => dietaryCategories[b] - dietaryCategories[a])
      .slice(0, 3);

    const dietaryCount = Object.keys(dietaryCategories).length;

    // Update stats with calculated values
    setStats([
      {
        title: "Total Menu Items",
        value: totalMenuItems.toString(),
        change: `+${newItemsThisWeek} new items this week`,
        icon: <FaUtensils className="h-5 w-5 text-gray-500" />,
      },
      {
        title: "Orders",
        value: totalOrders.toString(),
        change: orderPercentChange,
        icon: <FaShoppingCart className="h-5 w-5 text-gray-500" />,
      },
      {
        title: "Active Meal Plans",
        value: activeMealPlans.toString(),
        change: "Based on unique users",
        icon: <FaCoffee className="h-5 w-5 text-gray-500" />,
      },
      {
        title: "Dietary Options",
        value: dietaryCount.toString(),
        change: topDietaryRestrictions.join(", "),
        icon: <FaUsers className="h-5 w-5 text-gray-500" />,
      },
    ]);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          <p className="text-xs text-gray-500">{stat.change}</p>
        </div>
      ))}
    </div>
  );
};

export default CafeteriaStats;