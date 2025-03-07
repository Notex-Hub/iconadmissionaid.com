import { useMemo } from "react";
import useDashboardOverview from "../../../Hooks/useAdmindashboard";

const AdminCampus = () => {
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
    </div>
  );
};

export default AdminCampus;
