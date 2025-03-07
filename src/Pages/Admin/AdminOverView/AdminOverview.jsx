import { useMemo } from "react";
import useDashboardOverview from "../../../Hooks/useAdmindashboard";
import { OverView } from "../../../Ui/OverView";
import { RecentActivity } from "../../../Ui/RecentActivity";

const AdminOverview = () => {
  const [data]=useDashboardOverview()


  const overData = useMemo(()=>data?.data?data?.data:[],[data])


/* admin-dashboard */


  return (
    <div className="space-y-4">
      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-5 grid-cols-3">
        {
          overData?.summary?.map((summary,index)=><div className="card"
          key={index}
          >
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">{summary?.name}</div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{summary?.value}</div>
          </div>
        </div>)
        }
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

export default AdminOverview;
