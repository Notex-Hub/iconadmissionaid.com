/* eslint-disable react/no-unescaped-entities */
import CafeteriaStats from "../../../Ui/CafeteriaStats";
import DayWiseMenuTable from "../../../Ui/DayWiseMenuTable";


const OverviewTab = () => {
  const today = new Date().toLocaleString("en-us", { weekday: "long" });
  console.log(today);
  return (
    <div className="space-y-6 p-4">
      {/* Cafeteria Stats Section */}
      <CafeteriaStats />

      {/* Today's Menu Card */}
      <div className="bg-white shadow-md rounded-lg p-4 border">
        {/* Card Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Today's Menu</h2>
          <p className="text-gray-500 text-sm">Manage today's cafeteria menu items and availability</p>
        </div>

        {/* Card Content (Menu Table) */}
        {/* <CafeteriaMenuTable /> */}
        <DayWiseMenuTable />
      </div>
    </div>
  );
};

export default OverviewTab;
