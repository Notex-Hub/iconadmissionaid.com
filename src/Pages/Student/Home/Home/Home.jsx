
import { FaBus } from "react-icons/fa6";
import OvierViewData from "../OverviewData/OvierViewData";
import TodayData from "../TodayData/TodayData";
import Upcoming from "../Upcoming/Upcoming";
import { useEffect, useState } from "react";
import RealTimeDate from "../../../../Components/RealTimeDate";
import Navbar from "../Navbar/Navbar"
import useBus from "../../../../Hooks/useBus";
import moment from "moment/moment";
import useMeals from "../../../../Hooks/useMeals";
import useAllClasses from "../../../../Hooks/useAllClasses";
import { Book } from "lucide-react";


export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const [todaysMeals, setTodaysMeals] = useState(null);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [message, setMessage] = useState("");
  const [ bus ] = useBus();
  const [ classes ] = useAllClasses();
  const [ meals, refetch ] = useMeals();
 const busData=bus?.data;
 const mealsData=meals?.data;
 const classData=classes?.data;
const [nextBus, setNextBus] = useState(null);

  // Next Bus
  useEffect(() => {
    const findNextBus = () => {
      const currentTime = moment(); // Get current local time

      // Convert and filter buses based on upcoming arrival time
      const upcomingBuses = busData
        ?.filter((bus) => bus.stops.length > 0) // Ensure stops exist
        .map((bu) => {
          const firstStop = bu.stops[0]; // Get first stop
          return {
            ...bu,
            arrivalTime: moment(firstStop.arrival_time, "h:mmA"), // Convert time
          };
        })
        .filter((bu) => bu.arrivalTime.isAfter(currentTime)) // Remove past buses
        .sort((a, b) => a.arrivalTime.diff(b.arrivalTime)); // Sort by nearest arrival

      if (upcomingBuses?.length > 0) {
        setNextBus(upcomingBuses[0]); // Set the next arriving bus
      } else {
        setNextBus(null); // No upcoming buses
      }
    };

    findNextBus(); // Initial run
    const interval = setInterval(findNextBus, 60000); // Check every 1 min

    return () => clearInterval(interval); // Cleanup interval
  }, [busData]);

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

  // Current Meals 
  useEffect(() => {
    const updateMeals = () => {
      const currentTime = moment();

      // Meal time ranges
      const breakfastStartTime = moment().set({ hour: 7, minute: 0, second: 0 });
      const breakfastEndTime = moment().set({ hour: 10, minute: 59, second: 59 });

      const lunchStartTime = moment().set({ hour: 11, minute: 0, second: 0 });
      const lunchEndTime = moment().set({ hour: 15, minute: 59, second: 59 });

      const dinnerStartTime = moment().set({ hour: 18, minute: 0, second: 0 });
      const dinnerEndTime = moment().set({ hour: 1, minute: 0, second: 0 }).add(1, 'day'); // Next day 1 AM

      let filteredMeals = [];

      // Determine which meal to show based on current time
      if (currentTime.isBetween(breakfastStartTime, breakfastEndTime)) {
        filteredMeals = todaysMeals?.filter(meal => meal.type === "breakfast");
      } else if (currentTime.isBetween(lunchStartTime, lunchEndTime)) {
        filteredMeals = todaysMeals?.filter(meal => meal.type === "lunch");
      } else if (currentTime.isBetween(dinnerStartTime, dinnerEndTime)) {
        filteredMeals = todaysMeals?.filter(meal => meal.type === "dinner");
      }

      // Handle no available meals
      if (filteredMeals?.length === 0) {
        setMessage("No meal available at this time. Meal starts at: ");
        if (currentTime.isBefore(breakfastStartTime)) {
          setMessage(prev => prev + "7:00 AM");
        } else if (currentTime.isBefore(lunchStartTime)) {
          setMessage(prev => prev + "11:00 AM");
        } else if (currentTime.isBefore(dinnerStartTime)) {
          setMessage(prev => prev + "6:00 PM");
        } else {
          setMessage(prev => prev + "Meal is over for the day.");
        }
      } else {
        setMessage(""); // Clear message if meals are available
      }

      setCurrentMeal(filteredMeals);
      refetch(); // Refetch to reload the data
    };

    // Initial update on component mount
    updateMeals();

    // Set interval to check and update every minute
    const interval = setInterval(updateMeals, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [todaysMeals, refetch]);

  // Next Class



  useEffect(() => {
    const today = moment().format("dddd"); // Current day (e.g., "Monday")
    const currentTime = moment(); // Current time

    // Filter only today's classes
    const todayClasses = classData?.filter(cls => cls.day === today);

    // Convert class times to moment objects & sort
    const sortedClasses = todayClasses?.map(cls => ({
      ...cls,
        startTime: moment(cls.time.split(" - ")[0], "hh:mm A") // Extracting start time
      }))
      .sort((a, b) => a.startTime.diff(b.startTime));

    // Find the next class
    const upcomingClass = sortedClasses?.find(cls => cls.startTime.isAfter(currentTime));

    setNextClass(upcomingClass || null);
  }, [classData]);











console.log(nextClass)





  return (
    <div>
      <Navbar/>
      <div className="space-y-4 p-4 container mx-auto">
      <div className="flex justify-between items-center md:flex-row flex-col">
      <h1 className="text-2xl  font-semibold mt-5">Student Dashboard</h1>
      <RealTimeDate/>
      </div>

      <div className="flex space-x-4 border-b">
        {["overview", "today", "upcoming"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>


      <div className="mt-4">
        {activeTab === "overview" && (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-5">
          
          <div className="p-4  rounded-lg  bg-white">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 "><Book/> Next Class</h3>
            {
              nextClass === null ? <p>
                You have no next class.
              </p> : <>
              <h1 className="uppercase text-xl font-bold my-2">{nextClass?.courseId?.course_code}</h1>
            <p className=" text-xs text-gray-900">{nextClass?.time} • {nextClass?.room}</p>
              </>
            }
            
          </div>
      
          <div className="p-4  rounded-lg  bg-white">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 "> <FaBus/>Next Bus</h3>
            {
              nextBus === null ? 
                <p>No upcoming buses found.</p> : 
<> 
            <h1 className="uppercase text-xl font-bold my-2">Route: {nextBus?.route_id}</h1>
            <p className=" text-xs text-gray-900">Arriving time {nextBus?.stops[0]?.arrival_time} • {nextBus?.stops[0]?.stop_name}</p> </>             
            }
            
          </div>

          <div className="p-4  rounded-lg  bg-white">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 "> Today Special Meals</h3>
            {
              currentMeal?.length == 1 ? <>
              {
                currentMeal?.map((x, i) => <div key={i}>
                    <h1 className="uppercase text-xl font-bold my-2">{x?.name}</h1>
                    <p className=" text-xs text-gray-900">{x.type} • $ {x?.price}</p>
                </div> )
              }
          
              </> : <p>{message}</p>
            }
          
          </div>

          <div className="p-4  rounded-lg  bg-white">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 ">Upcoming Event</h3>
            <h1 className="uppercase text-xl font-bold my-2">Career Fair</h1>
            <p className=" text-xs text-gray-900">Tomorrow • 1:00 PM • Student Center</p>
          </div>

     
      </div>

      <OvierViewData/>
        </div>
        )}


        {activeTab === "today" && (
          <div className="space-y-4">
           <TodayData/>
          </div>
        )}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
          <Upcoming/>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
