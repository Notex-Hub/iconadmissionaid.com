import PropTypes from "prop-types";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by product..."
        className="w-full px-3 py-2 rounded-lg bg-gray-50 border-0 shadow-inner text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
