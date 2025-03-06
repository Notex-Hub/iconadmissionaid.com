import { OverView } from "../../../../Ui/OverView";
import { RecentActivity } from "../../../../Ui/RecentActivity";



const OverViewTabContent = () => {
  return (
    <div className="space-y-4">
      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Courses Teaching</div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">77</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Total Students</div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">66</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Upcoming Classes</div>
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">44</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between pb-2">
            <div className="card-title text-sm font-medium">Research Projects</div>
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
            <OverView/>
          </div>
        </div>

        <div className="card col-span-3 lg:ml-28 lg:mt-10">
          <div className="card-header">
            <div className="card-title my-2">Recent Activity</div>
          </div>
          <div className="card-content">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverViewTabContent;
