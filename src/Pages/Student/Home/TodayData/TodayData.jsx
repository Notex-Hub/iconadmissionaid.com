/* eslint-disable react/no-unescaped-entities */
import moment from "moment";
import useAllClasses from "../../../../Hooks/useAllClasses";
import useBus from "../../../../Hooks/useBus";
import useMeals from "../../../../Hooks/useMeals";
import { useEffect, useState } from "react";


const TodayData = () => {
   const [todaysMeals, setTodaysMeals] = useState(null);
  const [ bus ] = useBus();
  const [ classes ] = useAllClasses();
  const [ meals, refetch ] = useMeals();
  const mealsData=meals?.data;
  const busData=bus?.data;
  const classData=classes?.data;
    const today = moment().format("dddd"); // Current day (e.g., "Monday")
  
      // Filter only today's classes
      const todayClasses = classData?.filter(cls => cls.day === today);

// console.log(todayClasses)

  // Today Meals
  useEffect(() => {
    const today = moment().format("dddd"); // Example: "Monday"

    const todayMealData = mealsData?.find((meal) => meal.day === today);

    if (todayMealData) {
      setTodaysMeals(todayMealData.meals);
    } else {
      setTodaysMeals([]);
    }
  }, [mealsData]);

 

  return (
    <div className="space-y-4">
      {/* Today's Schedule */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold">Today's Schedule</h3>
          <p className="text-sm text-gray-500">Your classes and events for today</p>
        </div>
        <div className="card-content space-y-4">
          {todayClasses?.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-[120px] text-sm font-medium">{item?.time}</div>
              <div className="flex-1">
                <div className="font-medium">{item?.courseId?.course_name}</div>
                <div className="text-sm text-gray-500">{item?.room}</div>
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
                {/* {item.type.charAt(0).toUpperCase() + item.type.slice(1)} */}
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
            {todaysMeals?.map((meal, index) => (
              <div key={index}>
                <h4 className="font-medium uppercase">{meal?.type} ({meal?.category}) </h4>
                <ul className="mt-2 space-y-2 text-sm">
               
                    <li  className="flex justify-between">
                      <p>{meal?.name}</p>
                      <p className="flex flex-col text-green-600"> <span>Calories:{meal?.calories}g</span> 
                      <span>Protein:{meal?.protein}</span> 
                      <span>Fat:{meal?.fat}</span>
                      <span>Carbs:{meal?.carbs}</span>
                      </p>
                      <span className=" text-black font-semibold">$ {meal?.price}</span>
                    </li>
                
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
            {busData?.map((route, index) => (
              <div key={index}>

                <div className="flex ">
                <h4 className="font-medium mr-2">Route:{route.route_id} -</h4>
                {route?.stops?.map((place, idx) => (
                    <div key={idx} className="flex">
   <div  className="">{place?.stop_name},</div>
                    </div>
     
                  ))}
                </div>
             
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  {route?.stops?.map((time, idx) => (
                    <div key={idx} className="">
                                     <div  className="rounded-md bg-gray-200 px-2 py-1 text-center">{time?.arrival_time}</div>
                                     <div  className="rounded-md bg-gray-200 px-2 py-1 text-center mt-2">{time?.departure_time}</div>
                    </div>
     
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
