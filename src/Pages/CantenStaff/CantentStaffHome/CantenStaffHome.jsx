import { useState } from "react";
import OverviewTab from "../OverviewContent/OverviewTab";
import useMeals from "../../../Hooks/useMeals";
import MealItemModal from "../../../Ui/MealItemModal";
import MealTypeTable from "../../../Ui/CafeteriaMenuTable";

const CantenStaffHome = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [, refetch] = useMeals();

  const handleSave = () => {
    setModalOpen(false);
    refetch();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl font-bold tracking-tight">
          Cafeteria Management
        </h2>
        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-2 bg-blue-600 text-white rounded-md cursor-pointer text-sm"
            onClick={() => setModalOpen(true)}
          >
            Add New Menu Item
          </button>
        </div>
      </div>

      <div className="w-full">
        {/* Tabs List */}
        <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4 bg-gray-200 w-fit px-5 rounded-lg py-1 mt-4 mb-4">
          {["overview", "breakfast", "lunch", "dinner", "special"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-all 
              ${
                activeTab === tab
                  ? "bg-white text-black rounded-md"
                  : "cursor-pointer"
              }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Tabs Content */}
        <div className="text-gray-700">
          {activeTab === "overview" && (
            <div>
              <OverviewTab />
            </div>
          )}

          {/* Show MealTypeTable for each meal type tab */}
          {activeTab === "breakfast" && <MealTypeTable mealType="breakfast" />}
          {activeTab === "lunch" && <MealTypeTable mealType="lunch" />}
          {activeTab === "dinner" && <MealTypeTable mealType="dinner" />}

          {/* Special tab content for special menu items */}
          {activeTab === "special" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium mb-2">Special Menu Items</h3>
                <p className="text-gray-500">
                  Create and manage special menu items for events and holidays.
                </p>
              </div>

              {/* Feature Coming Soon */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-blue-800 font-medium">Coming Soon</p>
                <p className="text-blue-700 text-sm mt-1">
                  Special menu management will be available in the next update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global add item modal */}
      {modalOpen && (
        <MealItemModal
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          refetchData={refetch}
        />
      )}
    </div>
  );
};

export default CantenStaffHome;