/* eslint-disable react/prop-types */

export default function PaymentOptions({ value = "bkash", onChange = () => {} }) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className={`inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl  ${value === "bkash" ? "bg-green-50" : ""}`}>
        <input type="radio" name="pm" checked={value === "bkash"} onChange={() => onChange("bkash")} />
        <span>Bkash</span>
      </label>

      <label className={`inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl  ${value === "nagad" ? "bg-green-50" : ""}`}>
        <input type="radio" name="pm" checked={value === "nagad"} onChange={() => onChange("nagad")} />
        <span>Nagad</span>
      </label>

 
    </div>
  );
}
