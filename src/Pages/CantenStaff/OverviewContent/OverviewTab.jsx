/* eslint-disable react/no-unescaped-entities */
import CafeteriaMenuTable from "../../../Ui/CafeteriaMenuTable";
import CafeteriaStats from "../../../Ui/CafeteriaStats";


const OverviewTab = () => {
  return (
    <div className="space-y-6 p-4">
      {/* Cafeteria Stats Section */}
      <CafeteriaStats />

      {/* Today's Menu Card */}
      <div className="bg-white shadow-md rounded-lg p-6 border">
        {/* Card Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Today's Menu</h2>
          <p className="text-gray-500 text-sm">Manage today's cafeteria menu items and availability</p>
        </div>

        {/* Card Content (Menu Table) */}
        <CafeteriaMenuTable />
      </div>
    </div>
  );
};

export default OverviewTab;
