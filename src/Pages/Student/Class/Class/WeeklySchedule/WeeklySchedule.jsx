import { BookOpenIcon, ClockIcon } from "lucide-react";
import useAllClasses from "../../../../../Hooks/useAllClasses";


const WeeklySchedule = () => {
  const [ classes ] = useAllClasses();
  const classData=classes?.data;




  return (
    <div className=" mx-auto">
      <div className="">
        <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
        <p className="mt-2 text-gray-600">Your class schedule for the current semester</p>
      </div>

      <div className="space-y-6">
        
          <div  className="space-y-4">
            <h3 className="font-medium text-xl text-gray-800 capitalize"></h3>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {classData?.map((cls, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                >
                  <div className="space-y-2">
                    <div className="font-semibold text-lg text-gray-900">{cls?.courseId.course_name}</div>
                    <div className="text-sm text-gray-500">{cls?.courseId?.course_code}</div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="mr-2 h-5 w-5 text-gray-500" />
                {cls?.time}
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <BookOpenIcon className="mr-2 h-5 w-5 text-gray-500" />
                      {cls?.facultyId?.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

      </div>
    </div>
  );
};

export default WeeklySchedule;
