import { useEffect, useRef, useState } from "react";
import { FaEllipsisV,  FaPlus } from "react-icons/fa";
import Modal from "./Modal"; // Importing the modal component

const menuItemsData = [
  { id: "ITEM001", name: "Grilled Chicken Sandwich", category: "Lunch", price: "$5.99", calories: 450, available: true, dietary: ["Protein-rich"] },
  { id: "ITEM002", name: "Vegetable Stir Fry", category: "Dinner", price: "$6.50", calories: 380, available: true, dietary: ["Vegetarian", "Vegan"] },
  { id: "ITEM003", name: "Pancakes with Maple Syrup", category: "Breakfast", price: "$4.25", calories: 520, available: true, dietary: ["Vegetarian"] },
  { id: "ITEM003", name: "Pancakes with Maple Syrup", category: "Breakfast", price: "$4.25", calories: 520, available: true, dietary: ["Vegetarian"] },
  { id: "ITEM003", name: "Pancakes with Maple Syrup", category: "Breakfast", price: "$4.25", calories: 520, available: true, dietary: ["Vegetarian"] },
  { id: "ITEM003", name: "Pancakes with Maple Syrup", category: "Breakfast", price: "$4.25", calories: 520, available: true, dietary: ["Vegetarian"] },
  { id: "ITEM003", name: "Pancakes with Maple Syrup", category: "Breakfast", price: "$4.25", calories: 520, available: true, dietary: ["Vegetarian"] },
  { id: "ITEM003", name: "Pancakes with Maple Syrup", category: "Breakfast", price: "$4.25", calories: 520, available: true, dietary: ["Vegetarian"] },
  { id: "ITEM003", name: "Pancakes with Maple Syrup", category: "Breakfast", price: "$4.25", calories: 520, available: true, dietary: ["Vegetarian"] },
];

const CafeteriaMenuTable = () => {
  const [menuItems, setMenuItems] = useState(menuItemsData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Open modal for adding a new item
  const openAddModal = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);  // Close modal if click is outside
    }
  };

  // Attach event listener to handle click outside modal
useEffect(() => {
    document.addEventListener("mousedown", handleCloseModal);
    return () => {
      document.removeEventListener("mousedown", handleCloseModal);
    };
  }, []);
  // Open modal for editing an existing item
  const openEditModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // Handle item addition or update
  const handleSave = (item) => {
    if (selectedItem) {
      // Update existing item
      setMenuItems(menuItems.map((i) => (i.id === item.id ? item : i)));
    } else {
      // Add new item
      setMenuItems([...menuItems, { ...item, id: `ITEM${menuItems.length + 1}` }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full p-4">
      {/* Table Actions */}
      <div className="flex items-center justify-between mb-4">
        <button className="px-3 py-2 text-sm border rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2" onClick={openAddModal}>
          <FaPlus /> Add Item
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Calories</th>
              <th className="p-2 text-left">Dietary</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-100">
                <td className="p-2 font-medium">{item.name}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.price}</td>
                <td className="p-2">{item.calories}</td>
                <td className="p-2">
                  {item.dietary.length > 0 ? (
                    item.dietary.map((diet, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-200 rounded-md mr-1">
                        {diet}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">None</span>
                  )}
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 text-xs rounded-md ${item.available ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="p-2 text-right relative">
      <button
        className="p-1 rounded-md hover:bg-gray-200"
        onClick={toggleModal}
      >
        <FaEllipsisV />
      </button>

      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white shadow-md rounded-md z-50 transition-all duration-200"
        >
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Available
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Unavailable
          </button>
          <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
            Delete
          </button>
        </div>
      )}
    </td>
    
    
            
              </tr>


              
            ))}

            
          </tbody>

  
        </table>

      </div>

      {/* Modal Component */}
      {modalOpen && <Modal item={selectedItem} onClose={() => setModalOpen(false)} onSave={handleSave} />}
   
    </div>
  );
};

export default CafeteriaMenuTable;
