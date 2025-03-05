
import { FaBus } from "react-icons/fa6";
import OvierViewData from "../OverviewData/OvierViewData";
import TodayData from "../TodayData/TodayData";
import Upcoming from "../Upcoming/Upcoming";
import { useState } from "react";
import RealTimeDate from "../../../../Components/RealTimeDate";
import Navbar from "../Navbar/Navbar"


export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");


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
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 ">Next Class</h3>
            <h1 className="uppercase text-xl font-bold my-2">CS 101</h1>
            <p className=" text-xs text-gray-900">10:00 AM - 11:30 AM • Room 302</p>
          </div>
      
          <div className="p-4  rounded-lg  bg-white">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 "> <FaBus/>Next Bus</h3>
            <h1 className="uppercase text-xl font-bold my-2">Route B</h1>
            <p className=" text-xs text-gray-900">Arriving in 5 minutes • Main Stop</p>
          </div>
          <div className="p-4  rounded-lg  bg-white">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 ">Today Special</h3>
            <h1 className="uppercase text-xl font-bold my-2">Pasta Bar</h1>
            <p className=" text-xs text-gray-900">Main Cafeteria • $8.99</p>
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
