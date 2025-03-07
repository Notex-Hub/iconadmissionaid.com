import { useEffect, useMemo, useState } from "react";
import useAllClasses from "../../../../Hooks/useAllClasses";
import useCourse from "../../../../Hooks/useCourse";
import useUsers from "../../../../Hooks/useUsers";
import { OverView } from "../../../../Ui/OverView";
import { RecentActivity } from "../../../../Ui/RecentActivity";
import useDashboardOverview from "../../../../Hooks/useAdmindashboard";



const OverViewTabContent = () => {
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [ users ] = useUsers();
  const [ classes ] = useAllClasses();
  const [ course ] = useCourse();
  const userData=users?.data;
  const classData=classes?.data;
  const courseData=course?.data;
  const studentData = userData?.filter( x => x?.role === 'student')
  const [data]=useDashboardOverview()


  const overData = useMemo(()=>data?.data?data?.data:[],[data])


  
// Upcoming Class
  useEffect(() => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });

    const sortedClasses = classData?.sort((a, b) => {
     
      return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
    });

    // Find the next class
    const nextClass = sortedClasses?.find((classInfo) => {
      return daysOfWeek.indexOf(classInfo.day) > daysOfWeek.indexOf(currentDay);
    });

    if (nextClass) {
      setUpcomingClass(nextClass);
    } else {
      setUpcomingClass(null); // If no upcoming class, display none
    }
  }, [classData]);





  return (
    <div className="space-y-4">
      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Courses Teaching</div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{courseData?.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Total Students</div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{studentData?.length}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Upcoming Classes</div>
          </div>
         {
          upcomingClass === null ? <p>No Upcoming Class</p> :
          <div className="card-content">
          <div className="text-2xl font-bold">{upcomingClass?.length}</div>
        </div>
         }
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Research Projects</div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">4</div>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <div className="card col-span-4">
          <div className="card-header">
            <div className="card-title">Overview</div>
          </div>
          <div className="card-content pl-2">
            <OverView/>
          </div>
        </div>

        <div className="card col-span-3 lg:ml-28 lg:mt-10">
          <div className="card-header">
            <div className="card-title my-2">Recent Activity</div>
          </div>
          <div className="card-content">
          <RecentActivity 
            activities={overData?.recentactivity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverViewTabContent;
