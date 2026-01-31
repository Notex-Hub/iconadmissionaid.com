// components/exam/DescriptionField.tsx
"use client";

import React from "react";

interface Props {
  value?: string | null;
  onChange: (v: string | null) => void;
}

const DescriptionField: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium mb-2">Description</label>
      <textarea
        className="textarea p-2 textarea-bordered w-full"
        rows={6}
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder="Enter exam description..."
      />
    </div>
  );
};

export default DescriptionField;
