

const TodayData = () => {
  const scheduleItems = [
    { time: "10:00 AM - 11:30 AM", title: "CS 101", location: "Room 302", type: "class" },
    { time: "12:00 PM - 1:00 PM", title: "Lunch Break", location: "Main Cafeteria", type: "break" },
    { time: "2:00 PM - 3:30 PM", title: "MATH 201", location: "Room 156", type: "class" },
    { time: "4:00 PM - 5:00 PM", title: "Study Group", location: "Library", type: "meeting" },
  ];

  const meals = [
    { meal: "Breakfast", time: "7:00 AM - 10:00 AM", items: [
      { name: "Pancakes with Maple Syrup", price: "$5.99" },
      { name: "Egg & Cheese Sandwich", price: "$4.50" },
      { name: "Fruit Bowl", price: "$3.99" }
    ]},
    { meal: "Lunch", time: "11:00 AM - 2:00 PM", items: [
      { name: "Pasta Bar", price: "$8.99" },
      { name: "Grilled Chicken Sandwich", price: "$7.50" },
      { name: "Vegetarian Wrap", price: "$6.99" }
    ]},
    { meal: "Dinner", time: "5:00 PM - 8:00 PM", items: [
      { name: "Stir Fry Station", price: "$9.99" },
      { name: "Pizza", price: "$6.50" },
      { name: "Salad Bar", price: "$5.99" }
    ]}
  ];

  const busSchedule = [
    { route: "Route A (Main Campus → North Campus)", times: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"] },
    { route: "Route B (Main Campus → Downtown)", times: ["7:30 AM", "9:30 AM", "11:30 AM", "1:30 PM", "3:30 PM", "5:30 PM"] },
    { route: "Route C (Main Campus → Residence Halls)", times: ["8:15 AM", "10:15 AM", "12:15 PM", "2:15 PM", "4:15 PM", "6:15 PM"] }
  ];

  return (
    <div className="space-y-4">
      {/* Today's Schedule */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold">Today's Schedule</h3>
          <p className="text-sm text-gray-500">Your classes and events for today</p>
        </div>
        <div className="card-content space-y-4">
          {scheduleItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-[120px] text-sm font-medium">{item.time}</div>
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-gray-500">{item.location}</div>
              </div>
              <div
                className={`rounded-full px-2 py-1 text-xs ${
                  item.type === "class"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    : item.type === "break"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                }`}
              >
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Meals */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold">Today's Meals</h3>
            <p className="text-sm text-gray-500">Menu items available today</p>
          </div>
          <div className="card-content space-y-4">
            {meals.map((meal, index) => (
              <div key={index}>
                <h4 className="font-medium">{meal.meal} ({meal.time})</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {meal.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-gray-500">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bus Schedule */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold">Bus Schedule</h3>
            <p className="text-sm text-gray-500">Today's bus departures</p>
          </div>
          <div className="card-content space-y-4">
            {busSchedule.map((route, index) => (
              <div key={index}>
                <h4 className="font-medium">{route.route}</h4>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  {route.times.map((time, idx) => (
                    <div key={idx} className="rounded-md bg-gray-200 px-2 py-1 text-center">{time}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayData;
