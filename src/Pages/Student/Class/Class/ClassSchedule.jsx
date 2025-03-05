import  { useState } from 'react';
import WeeklySchedule from './WeeklySchedule/WeeklySchedule';
import Assignments from '../Assignments/Assignments';
import FacultyContacts from '../FacultyList/FacultyContacts';
import Navbar from '../../Home/Navbar/Navbar';

const ClassSchedule = () => {
    const [activeTab, setActiveTab] = useState('weekly');
  const [date, setDate] = useState(new Date());

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(); // Formats the date to 'MM/DD/YYYY'
  };

  return (

    <div>
      <Navbar/>
      <div className='container mx-auto p-4 my-5'>

<div className="flex items-center  justify-between">
    <h2 className="text-xl font-bold tracking-tight">Class Schedule</h2>
    <div className="flex items-center space-x-4">
      {/* Date Picker */}
      <div className="relative">
        <button className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
         
          {formatDate(date)}
        </button>

        {/* Custom Date Picker */}
        <input
          type="date"
          value={date.toISOString().split('T')[0]} // Convert date to 'YYYY-MM-DD' format
          onChange={handleDateChange}
          className="absolute top-0 left-0 z-10 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      {/* Export Button */}
      <button className="flex items-center px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs">
   
        Export Schedule
      </button>
    </div>
  </div>

  <div>
    <label htmlFor="search" className="sr-only">
      Search
    </label>
    <input
      id="search"
      type="text"
      placeholder="Search courses, assignments, or faculty..."
    
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 my-2"
    />
  </div>

  <div>
    <div className=" flex  bg-gray-100  overflow-hidden px-5  py-1 rounded-md">
      {/* Tabs */}
      <button
     className={`tab-trigger w-full py-2 text-sm font-medium ${activeTab === 'weekly' ? 'bg-white text-black font-semibold px-2  rounded-lg' : 'text-gray-600 cursor-pointer'}`}
        onClick={() => setActiveTab('weekly')}
      >
        Weekly Schedule
      </button>
      <button
className={`tab-trigger w-full py-2 text-sm font-medium ${activeTab === 'assignments' ? 'bg-white text-black font-semibold px-2  rounded-lg' : 'text-gray-600 cursor-pointer'}`}
        onClick={() => setActiveTab('assignments')}
      >
        Assignments
      </button>
      <button
        className={`tab-trigger w-full py-2 text-sm font-medium ${activeTab === 'faculty' ? 'bg-white text-black font-semibold px-2  rounded-lg' : 'text-gray-600 cursor-pointer'}`}
        onClick={() => setActiveTab('faculty')}
      >
        Faculty Contacts
      </button>
    </div>

    {/* Tab Content */}
    <div className="mt-4">
      {activeTab === 'weekly' && (
        <div>
         <WeeklySchedule/>
        </div>
      )}
      {activeTab === 'assignments' && (
        <div>
          <Assignments/>
        </div>
      )}
      {activeTab === 'faculty' && (
        <div>
          <FacultyContacts/>
        </div>
      )}
    </div>
  </div>




  </div>
    </div>
  
  );
};

export default ClassSchedule;
