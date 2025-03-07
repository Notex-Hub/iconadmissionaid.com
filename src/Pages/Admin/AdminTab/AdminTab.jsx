import  { useState } from 'react';
import AdminOverview from '../AdminOverView/AdminOverview';
import AdminCourses from '../AdminOverView/AdminCourses';
import AdminUsers from '../AdminOverView/AdminUsers';
import AdminCampus from '../AdminOverView/AdminCampus';
import AdminEvents from '../AdminOverView/AdminEvents';
import { CourseContent } from '../../Faculty/FacultyDashboard/ProfessorTab/CourseContent/CourseContent';



const AdminTab = () => {
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
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 'users' ? 'bg-white text-black rounded-md' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('users')}
        >
      Users
        </button>
      
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 'campus' ? 'bg-white text-black rounded-md' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('campus')}
        >
        Campus Map
        </button>
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 'events' ? 'bg-white text-black rounded-md' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('events')}
        >
        Events
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'overview' && <div>
          <AdminOverview/>
          </div>}
        {activeTab === 'courses' && <div>
        <CourseContent/>
          </div>}
        {activeTab === 'users' && <div>
          <AdminUsers/>
          </div>}
        {activeTab === 'campus' && <div>
          <AdminCampus/>
          </div>}
        {activeTab === 'events' && <div>
          <AdminEvents/>
          </div>}
       
      </div>
    </div>
  );
};

export default AdminTab;
