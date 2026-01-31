import React from "react";
import ModelTestRow from "./ModelTestRow";
import { ModelTestItem } from "./types/modelTest";

type Props = {
  items: ModelTestItem[];
  onDeleted?: () => void; // optional callback to refresh table after delete
};

export default function ModelTestTable({ items, onDeleted }: Props) {
  return (
    <div className="w-full overflow-x-auto border border-gray-100 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departments</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                No model tests found.
              </td>
            </tr>
          ) : (
            items.map((it, idx) => (
              <ModelTestRow key={it._id} item={it} index={idx} onDeleted={onDeleted} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
