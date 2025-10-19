import PropTypes from "prop-types";

export default function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  const base = "px-3 py-1 rounded-full text-xs font-semibold";
  if (s === "delivered") return <span className={`${base} bg-green-100 text-green-800`}>Delivered</span>;
  if (s === "processing") return <span className={`${base} bg-yellow-100 text-yellow-800`}>Processing</span>;
  if (s === "courier" || s === "shipped") return <span className={`${base} bg-blue-100 text-blue-800`}>Shipped</span>;
  if (s === "cancelled" || s === "returned") return <span className={`${base} bg-red-100 text-red-800`}>Cancelled</span>;
  return <span className={`${base} bg-gray-100 text-gray-800`}>{status || "—"}</span>;
}

StatusBadge.propTypes = {
  status: PropTypes.string,
};
