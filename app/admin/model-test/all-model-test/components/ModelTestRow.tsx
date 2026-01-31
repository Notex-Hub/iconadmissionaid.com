import React from "react";
import { ModelTestItem } from "./types/modelTest";
import { formatDate } from "./utils/format";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

type Props = {
  item: ModelTestItem;
  index: number;
  onDeleted?: () => void;
};

export default function ModelTestRow({ item, index, onDeleted }: Props) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/model-test/create-model-test?slug=${item.slug}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this model test?")) return;
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
      await axiosInstance.delete(`${API_BASE_URL}/model-test/${item.slug}`);
      toast({ title: "Success", description: "Model Test deleted", variant: "default" });
      onDeleted?.();
    } catch (err: any) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors even:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>

      <td className="px-4 py-3 text-sm">
        <Link href={`/admin/model-test/model-test-details?slug=${item.slug}`} className="text-indigo-600 hover:underline">
        <div className="flex items-center gap-3">
          <img
            src={item.image || "/placeholder-rect.png"}
            alt={item.title}
            className="w-12 h-8 object-cover rounded-md border"
          />
          <div>
            <div className="font-semibold text-gray-900">{item.title}</div>
            <div className="text-xs text-gray-500">{item.slug}</div>
          </div>
        </div>
        </Link>
      </td>

      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.university}</td>

      <td className="px-4 py-3 text-sm">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          item.testType === "in-course" 
            ? "bg-blue-50 text-blue-700 border border-blue-200" 
            : "bg-purple-50 text-purple-700 border border-purple-200"
        }`}>
          {item.testType === "in-course" ? "In-Course" : "Out-of-Course"}
        </span>
      </td>

      <td className="px-4 py-3 text-sm">
        {item.testType === "in-course" ? (
          <span className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600 border border-gray-200">
            Course Attached
          </span>
        ) : item.pricingType === "free" ? (
          <span className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200 font-medium">
            Free
          </span>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              Paid
            </span>
            {item.price && (
              <span className="text-xs text-gray-600 font-semibold">৳{item.price}</span>
            )}
          </div>
        )}
      </td>

      <td className="px-4 py-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {item.departments?.length ? (
            item.departments.map((d) => (
              <span
                key={d}
                className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                {d}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      </td>

      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(item.createdAt)}</td>

      <td className="px-4 py-3 text-sm">
        {item.isDeleted ? (
          <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-100">Deleted</span>
        ) : (
          <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">Active</span>
        )}
      </td>

      <td className="px-4 py-3 text-sm flex gap-2">
        <button
          onClick={handleEdit}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
