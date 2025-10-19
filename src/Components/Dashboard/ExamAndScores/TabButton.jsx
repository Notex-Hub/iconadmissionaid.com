/* eslint-disable react/prop-types */
const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-md font-medium transition ${
      active ? "bg-[#c21010] text-white" : "bg-gray-100 text-gray-700"
    }`}
  >
    {children}
  </button>
);

export default TabButton;
