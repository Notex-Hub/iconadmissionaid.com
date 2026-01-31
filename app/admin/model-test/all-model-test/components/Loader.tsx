import React from "react";

export default function Loader() {
  return (
    <div className="w-full flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-gray-300"></div>
    </div>
  );
}
