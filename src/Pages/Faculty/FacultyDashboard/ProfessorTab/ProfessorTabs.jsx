import  { useState } from 'react';
import OverViewTabContent from './OverViewTabContent';
import { CourseContent } from './CourseContent/CourseContent';
import { StudentContent } from './StudentContent/StudentContent';
import { ResearchContent } from './ResearchContent/ResearchContent';

const ProfessorTabs = () => {
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
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 'students' ? 'bg-white text-black rounded-md' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('students')}
        >
          Students
        </button>
      
        <button
          className={`py-2 px-4 text-lg font-semibold ${activeTab === 'research' ? 'bg-white text-black rounded-md' : 'text-gray-600 cursor-pointer'}`}
          onClick={() => handleTabChange('research')}
        >
          Research
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'overview' && <div>
          <OverViewTabContent/>
          </div>}
        {activeTab === 'courses' && <div><CourseContent/></div>}
        {activeTab === 'students' && <div><StudentContent/></div>}
        {activeTab === 'research' && <div><ResearchContent/></div>}
       
      </div>
    </div>
  );
};

export default ProfessorTabs;
