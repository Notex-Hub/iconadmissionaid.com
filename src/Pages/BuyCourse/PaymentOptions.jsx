/* eslint-disable react/prop-types */
import { useState } from "react";

export default function PaymentOptions({ value = "bkash", onChange = () => {} }) {
  const [method, setMethod] = useState(value);
  function select(m) {
    setMethod(m);
    onChange(m);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className={`flex-1 p-3 rounded-lg cursor-pointer ${method === "bkash" ? "bg-green-50 ring-1 ring-green-200" : "bg-gray-50"}`}>
          <input type="radio" name="pay" checked={method === "bkash"} onChange={() => select("bkash")} className="hidden" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Bkash</div>
              <div className="text-xs text-gray-500">Send payment to Bkash Personal/Business</div>
            </div>
            <div className="text-xs text-gray-500">Mobile</div>
          </div>
        </label>

        <label className={`flex-1 p-3 rounded-lg cursor-pointer ${method === "nagad" ? "bg-yellow-50 ring-1 ring-yellow-200" : "bg-gray-50"}`}>
          <input type="radio" name="pay" checked={method === "nagad"} onChange={() => select("nagad")} className="hidden" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Nagad</div>
              <div className="text-xs text-gray-500">Send payment to Nagad wallet</div>
            </div>
            <div className="text-xs text-gray-500">Mobile</div>
          </div>
        </label>
      </div>

      {method === "bkash" && (
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
          <div>Send ৳ to Bkash Number: <strong>01XXXXXXXXX</strong></div>
          <div className="mt-2">Use reference: <strong>OrderID after placing order</strong></div>
        </div>
      )}

      {method === "nagad" && (
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
          <div>Send ৳ to Nagad Number: <strong>01YYYYYYYYY</strong></div>
          <div className="mt-2">Use reference: <strong>OrderID after placing order</strong></div>
        </div>
      )}
    </div>
  );
}
