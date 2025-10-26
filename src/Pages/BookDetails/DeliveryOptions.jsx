
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function DeliveryOptions({ value = "inside", onChange = () => {} }) {
  const [charges, setCharges] = useState({ inside: 0, outside: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const res = await fetch("https://sandbox.iconadmissionaid.com/api/v1/delivery-charge");
        const data = await res.json();

        if (data.status && Array.isArray(data.data)) {
          const inside = data.data.find((item) => item.title.toLowerCase().includes("inside"));
          const outside = data.data.find((item) => item.title.toLowerCase().includes("outside"));

          setCharges({
            inside: inside?.charge || 0,
            outside: outside?.charge || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch delivery charges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharges();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-3">Delivery</h3>
      {loading ? (
        <div className="text-gray-500 text-sm">Loading delivery charges...</div>
      ) : (
        <div className="flex flex-col gap-3">
          <label className="inline-flex items-center gap-3 p-3 rounded-xl hover:shadow-sm cursor-pointer">
            <input
              type="radio"
              name="delivery"
              checked={value === "inside"}
              onChange={() => onChange("inside")}
            />
            <div>
              <div className="font-medium">Inside Dhaka</div>
              <div className="text-sm text-gray-500">Delivery charge: ৳{charges.inside}</div>
            </div>
          </label>

          <label className="inline-flex items-center gap-3 p-3 rounded-xl hover:shadow-sm cursor-pointer">
            <input
              type="radio"
              name="delivery"
              checked={value === "outside"}
              onChange={() => onChange("outside")}
            />
            <div>
              <div className="font-medium">Outside Dhaka</div>
              <div className="text-sm text-gray-500">Delivery charge: ৳{charges.outside}</div>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
