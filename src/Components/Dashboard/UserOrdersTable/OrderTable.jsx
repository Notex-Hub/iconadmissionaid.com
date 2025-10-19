import PropTypes from "prop-types";
import ProductItem from "./ProductItem";
import StatusBadge from "./StatusBadge";

export default function OrderTable({ items, onDownload }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="py-3 px-3">Products</th>
            <th className="py-3 px-3 w-28">Amount</th>
            <th className="py-3 px-3 w-32">Payment</th>
            <th className="py-3 px-3 w-32">Status</th>
            <th className="py-3 px-3 w-36">Date</th>
            <th className="py-3 px-3 w-36 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o._id} className="align-top">
              <td className="py-4 px-3">
                <div className="flex flex-col gap-3">
                  {Array.isArray(o.productId) && o.productId.length > 0 ? (
                    o.productId.map((p) => <ProductItem key={p._id} p={p} />)
                  ) : (
                    <div className="text-sm text-gray-400">No products</div>
                  )}
                </div>
              </td>
              <td className="py-4 px-3 font-medium">৳ {o.totalAmount ?? o.paidAmount ?? "-"}</td>
              <td className="py-4 px-3 capitalize">{String(o.paymentStatus || "—")}</td>
              <td className="py-4 px-3"><StatusBadge status={o.status || "—"} /></td>
              <td className="py-4 px-3">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</td>
              <td className="py-4 px-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      try { navigator.clipboard?.writeText(o._id); alert("Order ID copied"); } catch { prompt("Copy order id:", o._id); }
                    }}
                    className="px-3 py-2 bg-white rounded-lg text-sm shadow-sm"
                  >
                    Copy
                  </button>

                  {Array.isArray(o.productId) && o.productId[0] && (o.productId[0].pdf || o.productId[0].uploadLink) ? (
                    <>
                      <a href={o.productId[0].pdf || o.productId[0].uploadLink} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white rounded-lg text-sm shadow-sm">View</a>
                      <button
                        onClick={() => onDownload(o.productId[0].pdf || o.productId[0].uploadLink, `${o.productId[0].title || "product"}.pdf`)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
                      >
                        Download
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-500">No file</div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

OrderTable.propTypes = {
  items: PropTypes.array.isRequired,
  onDownload: PropTypes.func.isRequired,
};
