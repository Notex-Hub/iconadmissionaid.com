/* eslint-disable react/prop-types */
export default function OrderSummary({ cover, title, payable = 0, deliveryCharge = 0, grandTotal = 0 }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow">
      <div className="flex items-center gap-3">
        <img src={cover} alt="" className="w-16 h-12 object-cover rounded-md" />
        <div>
          <div className="text-sm text-gray-500">Selected Book</div>
          <div className="font-semibold text-gray-900">{title}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>Book price</div>
          <div>৳{payable}</div>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <div>Delivery</div>
          <div>৳{deliveryCharge}</div>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm font-semibold text-gray-900">
          <div>Total</div>
          <div>৳{grandTotal}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">After placing the order, follow the payment instructions for your selected method to complete the payment.</div>
    </div>
  );
}
