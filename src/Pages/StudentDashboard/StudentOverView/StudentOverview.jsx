import { useMemo } from "react";
import useDashboardOverview from "../../../Hooks/useAdmindashboard";
import { OverView } from "../../../Ui/OverView";
import { RecentActivity } from "../../../Ui/RecentActivity";

const StudentOverview = () => {
  const [data] = useDashboardOverview();
console.log(data)
  const overData = useMemo(() => (data?.data ? data?.data : []), [data]);

  return (
    <div className="space-y-4">
      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">
              Courses Enrolled
            </div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">77</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Current GPA</div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">66</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">
              Upcoming Events
            </div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">44</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">
              Library Books Due
            </div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">400</div>
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
            <OverView />
          </div>
        </div>

        <div className="card col-span-3 lg:ml-28 lg:mt-10">
          <div className="card-header">
            <div className="card-title my-2">Recent Activity</div>
          </div>
          <div className="card-content">
            <RecentActivity activities={overData?.recentactivity} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
