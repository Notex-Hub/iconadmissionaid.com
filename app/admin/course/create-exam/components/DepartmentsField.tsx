// components/exam/DepartmentsField.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  value?: string[];
  onChange: (arr: string[]) => void;
}

const DepartmentsField: React.FC<Props> = ({ value = [], onChange }) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const v = input.trim();
    if (!v) return;
    if (value.includes(v)) {
      setInput("");
      return;
    }
    const next = [...value, v];
    onChange(next);
    setInput("");
  };

  const removeTag = (t: string) => {
    onChange(value.filter((x) => x !== t));
  };

  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium mb-2">Departments</label>

      <div className="flex gap-2 items-center mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Type department and press Enter or click Add"
          className="input p-2 input-bordered"
        />
        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((d) => (
          <span key={d} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
            <span className="text-sm">{d}</span>
            <button onClick={() => removeTag(d)} className="p-1 rounded-full hover:bg-gray-200">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsField;
