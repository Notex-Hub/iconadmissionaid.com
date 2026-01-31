// components/exam/UniversityField.tsx
"use client";

import React from "react";

interface Props {
  value?: string | null;
  onChange: (v: string | null) => void;
}

const UniversityField: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="col-span-full md:col-span-1">
      <label className="block text-sm font-medium mb-2">University Name</label>
      <input
        className="input input-bordered w-full p-2"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder="Enter university name"
      />
    </div>
  );
};

export default UniversityField;
