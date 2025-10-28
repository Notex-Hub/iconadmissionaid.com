/* eslint-disable react/prop-types */

const UniversitySmallCard = ({ 
  universities = [], 
  selectedId = null, 
  onSelect = () => {} 
}) => {
  console.log(universities)
  // universities = [{ id, title, img, slug? }]
  return (
    <div className="max-w-6xl mx-auto md:flex justify-center md:justify-center items-center gap-5 md:flex-wrap my-10 grid grid-cols-2">
      {/* "All" card */}
      <button
        onClick={() => onSelect(null)}
        className={`flex cursor-pointer flex-col justify-center items-center px-6 py-3 rounded-xl border transition ${
          selectedId === null ? "border-indigo-600 shadow-md" : "border-gray-200"
        }`}
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-sm font-semibold">
          All
        </div>
        <p className="mt-2 text-sm font-medium text-gray-700 text-center">All</p>
      </button>

      {universities.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex cursor-pointer flex-col justify-center items-center px-6 py-3 rounded-xl border transition ${
            selectedId === item.id ? "border-indigo-600 shadow-md" : "border-gray-200"
          }`}
        >
          <img
            className="w-12 h-12 object-contain rounded-full border p-1"
            src={item.img}
            alt={item.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/public/university/default.png";
            }}
          />
          <p className="mt-2 text-sm font-medium text-gray-700 text-center">
            {item.title}
          </p>
        </button>
      ))}
    </div>
  );
};

export default UniversitySmallCard;
