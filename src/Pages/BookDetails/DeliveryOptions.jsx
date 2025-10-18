/* eslint-disable react/prop-types */
export default function DeliveryOptions({ value = "inside", onChange = () => {}, charges = { inside: 80, outside: 120 } }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-lg font-semibold mb-3">Delivery</h3>
      <div className="flex flex-col gap-3">
        <label className="inline-flex items-center gap-3 p-3 rounded-xl  hover:shadow-sm cursor-pointer">
          <input type="radio" name="delivery" checked={value === "inside"} onChange={() => onChange("inside")} />
          <div>
            <div className="font-medium">Inside Dhaka</div>
            <div className="text-sm text-gray-500">Delivery charge: ৳{charges.inside}</div>
          </div>
        </label>

        <label className="inline-flex items-center gap-3 p-3 rounded-xl  hover:shadow-sm cursor-pointer">
          <input type="radio" name="delivery" checked={value === "outside"} onChange={() => onChange("outside")} />
          <div>
            <div className="font-medium">Outside Dhaka</div>
            <div className="text-sm text-gray-500">Delivery charge: ৳{charges.outside}</div>
          </div>
        </label>
      </div>
    </div>
  );
}