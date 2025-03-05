/* eslint-disable react/prop-types */
import { useState } from "react";

const Modal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    item || { name: "", category: "", price: "", calories: "", available: true, dietary: [] }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{item ? "Edit Item" : "Add Item"}</h2>
        
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mb-3"
        />
        
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mb-3"
        />

        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mb-3"
        />

        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={formData.calories}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mb-3"
        />

        <div className="flex justify-between">
          <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => onSave(formData)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
