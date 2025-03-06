import { useState } from "react";
import OverviewTab from "../OverviewContent/OverviewTab";
import useMeals from "../../../Hooks/useMeals";
import MealItemModal from "../../../Ui/MealItemModal";

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
        <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4 bg-gray-200 w-fit px-5 rounded-lg py-1">
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
        <div className="p-4 text-gray-700">
          {activeTab === "overview" && (
            <div className="">
              <OverviewTab />
            </div>
          )}
          {activeTab === "breakfast" && <p>Breakfast Menu</p>}
          {activeTab === "lunch" && <p>Lunch Menu</p>}
          {activeTab === "dinner" && <p>Dinner Menu</p>}
          {activeTab === "special" && <p>Special Menus</p>}
        </div>
      </div>

      {/* Add Item Modal */}
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