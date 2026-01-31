// components/exam/FreePriceField.tsx
"use client";

import React, { useState, useEffect } from "react";

interface Props {
  isFree?: "true" | "false";
  onChangeIsFree: (v: "true" | "false") => void;
  price?: string;
  onChangePrice: (v: string) => void;
}

const FreePriceField: React.FC<Props> = ({
  isFree = "true",
  onChangeIsFree,
  price = "",
  onChangePrice,
}) => {
  // local state for typing
  const [localPrice, setLocalPrice] = useState(price || "");

  // sync when parent updates price externally
  useEffect(() => {
    setLocalPrice(price || "");
  }, [price]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onChangePrice(localPrice.trim());
      e.currentTarget.blur(); // blur after enter
    }
  };

  const handleBlur = () => {
    onChangePrice(localPrice.trim());
  };

  return (
    <div className="col-span-full md:col-span-1 grid grid-cols-2 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium mb-2">Is Free?</label>
        <select
          className="input p-2 input-bordered w-full"
          value={isFree}
          onChange={(e) => onChangeIsFree(e.target.value as "true" | "false")}
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Price</label>
        <input
          type="text"
          inputMode="decimal"
          pattern="\d*\.?\d*"
          className={`input p-2 input-bordered w-full ${
            isFree === "true" ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          value={localPrice}
          onChange={(e) => setLocalPrice(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Enter price..."
          disabled={isFree === "true"}
        />
      </div>
    </div>
  );
};

export default FreePriceField;
