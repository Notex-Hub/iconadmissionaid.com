/* eslint-disable react/prop-types */
import { useState } from "react";

export default function CheckoutForm({ buyer = { name: "", phone: "" }, onChange = () => {} }) {
  const [local, setLocal] = useState(buyer);

  function update(part) {
    const next = { ...local, ...part };
    setLocal(next);
    onChange(next);
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Buyer information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Full name</label>
          <input
            value={local.name}
            onChange={(e) => update({ name: e.target.value })}
            type="text"
            placeholder="Your full name"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-gray-200 focus:ring-0"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone number</label>
          <input
            value={local.phone}
            onChange={(e) => update({ phone: e.target.value })}
            type="tel"
            placeholder="+8801XXXXXXXXX"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-gray-200 focus:ring-0"
          />
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        If you have an account and are logged in, name and phone will auto-fill.
      </div>
    </div>
  );
}
