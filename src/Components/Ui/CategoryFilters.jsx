/* eslint-disable react/prop-types */

const CategoryFilters = ({ categories, selectedCategoryId, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 my-4 px-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
          selectedCategoryId === null ? "bg-[#5D0000] text-white" : "bg-white text-gray-800 border"
        } whitespace-normal text-center max-w-[160px]`}
      >
        All Categories
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelectCategory(cat._id)}
          className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base ${
            selectedCategoryId === cat._id ? "bg-[#5D0000] text-white" : "bg-white text-gray-800 border"
          } whitespace-normal text-center max-w-[160px]`}
        >
          {cat.title}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
