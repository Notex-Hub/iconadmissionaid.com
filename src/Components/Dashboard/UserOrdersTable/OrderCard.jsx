import PropTypes from "prop-types";
import StatusBadge from "./StatusBadge";
import ProductItem from "./ProductItem";

export default function OrderCard({ order, onDownload }) {
  return (
    <article className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs text-gray-400">Order</div>
          <div className="mt-1">
            {Array.isArray(order.productId) && order.productId.length > 0 ? (
              order.productId.map((p) => <div key={p._id} className="py-2"><ProductItem p={p} /></div>)
            ) : (
              <div className="text-sm text-gray-400">No products</div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <StatusBadge status={order.status} />
          <div className="text-sm font-semibold">৳ {order.totalAmount ?? order.paidAmount ?? "-"}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              try { navigator.clipboard?.writeText(order._id); alert("Order ID copied"); } catch { prompt("Copy order id:", order._id); }
            }}
            className="px-3 py-2 bg-white rounded-lg text-sm shadow-sm"
          >
            Copy
          </button>

          {Array.isArray(order.productId) && order.productId[0] && (order.productId[0].pdf || order.productId[0].uploadLink) ? (
            <>
              <a href={order.productId[0].pdf || order.productId[0].uploadLink} target="_blank" rel="noreferrer" className="px-3 py-2 bg-white rounded-lg text-sm shadow-sm">View</a>
              <button
                onClick={() => onDownload(order.productId[0].pdf || order.productId[0].uploadLink, `${order.productId[0].title || "product"}.pdf`)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Download
              </button>
            </>
          ) : (
            <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-500">No file</div>
          )}
        </div>

        <div className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</div>
      </div>
    </article>
  );
}

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  onDownload: PropTypes.func.isRequired,
};
