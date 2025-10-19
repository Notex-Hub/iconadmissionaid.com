import PropTypes from "prop-types";

export default function ProductItem({ p }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img src={p.coverPhoto} alt={p.title} className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{p.title}</div>
        <div className="text-xs text-gray-400">{p.bookType || ""} • ৳ {p.price ?? "-"}</div>
      </div>
    </div>
  );
}

ProductItem.propTypes = {
  p: PropTypes.object.isRequired,
};
