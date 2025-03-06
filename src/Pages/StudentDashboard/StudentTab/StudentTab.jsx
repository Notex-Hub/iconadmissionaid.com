import  { useState } from 'react';
import StudentOverview from '../StudentOverView/StudentOverview';
import { StudentCourse } from '../StudentCourse/StudentCourse';
import { StudentClassSchedule } from '../StudentClassShedule/StudentClassSchedule';
import { CampusLife } from '../CampusLife/CampusLife';


const StudentTab = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='my-5'>
      <div className="flex flex-wrap   bg-gray-300 w-fit py-1 px-5 rounded-md">
        <button
          className={`py-2 px-4  font-semibold ${activeTab === 'overview' ? 'bg-white text-black rounded-md ' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('overview')}
        >
       Overview
        </button>
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 'courses' ? 'bg-white text-black rounded-md' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('courses')}
        >
          Courses
        </button>
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 'schedule' ? 'bg-white text-black rounded-md' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('schedule')}
        >
        Schedule
        </button>
      
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 'campus' ? 'bg-white text-black rounded-md' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('campus')}
        >
      Campus Life
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'overview' && <div>
     <StudentOverview/>
          </div>}
        {activeTab === 'courses' && <div><StudentCourse/></div>}
        {activeTab === 'schedule' && <div><StudentClassSchedule/></div>}
        {activeTab === 'campus' && <div><CampusLife/></div>}
       
      </div>
    </div>
  );
};

export default StudentTab;
