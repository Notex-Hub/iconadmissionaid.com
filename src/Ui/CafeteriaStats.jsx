import { FaUtensils, FaShoppingCart, FaCoffee, FaUsers } from "react-icons/fa"; // Using react-icons for icons

const stats = [
  {
    title: "Total Menu Items",
    value: "142",
    change: "+6 new items this week",
    icon: <FaUtensils className="h-5 w-5 text-gray-500" />,
  },
  {
    title: "Daily Orders",
    value: "2,350",
    change: "+12.5% from last week",
    icon: <FaShoppingCart className="h-5 w-5 text-gray-500" />,
  },
  {
    title: "Active Meal Plans",
    value: "8,234",
    change: "+2.1% from last month",
    icon: <FaCoffee className="h-5 w-5 text-gray-500" />,
  },
  {
    title: "Dietary Restrictions",
    value: "1,245",
    change: "Vegetarian, Vegan, Gluten-free, etc.",
    icon: <FaUsers className="h-5 w-5 text-gray-500" />,
  },
];

const CafeteriaStats = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
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
