"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ------- Config -------
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
const API_BASE = `${API_BASE_URL}/delivery-charge`;

// Schema (no slug)
const formSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1, "Title is required"),
  charge: z.coerce
    .number({ invalid_type_error: "Charge must be a number" })
    .nonnegative("Charge cannot be negative"),
});

export type DeliveryChargeDTO = z.infer<typeof formSchema> & {
  _id?: string;
  // Optional slug only to tolerate old data coming from backend (not used in UI)
  slug?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// Small UI helpers (Tailwind only so it works anywhere)
const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
> = ({ label, error, className = "", ...props }) => (
  <label className="block space-y-1">
    {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    <input
      className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 ${
        error ? "border-red-400" : "border-gray-300"
      } ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </label>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }
> = ({ variant = "primary", className = "", ...props }) => (
  <button
    className={
      `rounded-xl px-4 py-2 text-sm font-medium transition ${
        variant === "primary"
          ? "bg-black text-white hover:bg-black/90"
          : variant === "secondary"
          ? "bg-gray-100 hover:bg-gray-200"
          : "hover:bg-gray-100"
      } ` + className
    }
    {...props}
  />
);

const Chip: React.FC<{ children: React.ReactNode; color?: "green" | "red" | "gray" }> = ({
  children,
  color = "gray",
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      color === "green"
        ? "bg-green-100 text-green-800"
        : color === "red"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800"
    }`}
  >
    {children}
  </span>
);

// Toast (super minimal)
const toast = (msg: string) => {
  if (typeof window !== "undefined") {
    console.log(msg);
  }
};

// ------- Component -------
export default function DeliveryChargeManager() {
  const [items, setItems] = useState<DeliveryChargeDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryChargeDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", charge: 0 },
  });

  // Fetch all
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const payload = await res.json();
      const data = payload?.data || payload;
      setItems(Array.isArray(data?.data) ? data.data : data);
    } catch (e: any) {
      console.error(e);
      toast(e?.message || "Failed to load delivery charges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.title?.toLowerCase().includes(q));
  }, [items, query]);

  // Create
  const onCreate = async (values: DeliveryChargeDTO) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/create-delivery-charge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: values.title, charge: values.charge }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Create failed");
      toast("Created successfully");
      reset({ title: "", charge: 0 });
      await fetchAll();
    } catch (e: any) {
      console.error(e);
      toast(e?.message || "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Update
  const onUpdate = async (id: string, values: Partial<DeliveryChargeDTO>) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: values.title, charge: values.charge }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Update failed");
      toast("Updated successfully");
      setEditingId(null);
      await fetchAll();
    } catch (e: any) {
      console.error(e);
      toast(e?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete (soft delete)
  const onDelete = async (id: string) => {
    if (!id) return;
    const ok = confirm("Are you sure you want to delete this delivery charge?");
    if (!ok) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Delete failed");
      toast("Deleted successfully");
      await fetchAll();
    } catch (e: any) {
      console.error(e);
      toast(e?.message || "Delete failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Delivery Charge Manager</h1>
          <p className="text-sm text-gray-500">Add, update and view delivery charges</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search by title"
            className="w-64 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="secondary" onClick={fetchAll} disabled={loading}>
            Refresh
          </Button>
        </div>
      </header>

      {/* Create Form */}
      <section className="rounded-2xl border border-gray-200 p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Create New</h2>
        <form onSubmit={handleSubmit(onCreate)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Title *"
            placeholder="e.g. Inside Dhaka"
            {...register("title")}
            error={errors.title?.message}
          />
          <Input
            label="Charge *"
            type="number"
            step="any"
            placeholder="e.g. 70"
            {...register("charge", { valueAsNumber: true })}
            error={errors.charge?.message}
          />

          <div className="md:col-span-3 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={submitting}>
              Create
            </Button>
          </div>
        </form>
      </section>

      {/* List / Table */}
      <section className="rounded-2xl border border-gray-200 p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">All Delivery Charges</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="w-60 px-3 py-2">Title</th>
                <th className="w-32 px-3 py-2">Charge</th>
                <th className="w-40 px-3 py-2">Status</th>
                <th className="w-64 px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td className="px-3 py-6 text-center" colSpan={4}>
                    Loading...
                  </td>
                </tr>
              ) : filtered?.length ? (
                filtered.map((item) => (
                  <Row
                    key={item._id || `${item.title}-${item.charge}`}
                    item={item}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    submitting={submitting}
                    editingId={editingId}
                    setEditingId={setEditingId}
                  />
                ))
              ) : (
                <tr>
                  <td className="px-3 py-6 text-center" colSpan={4}>
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Row({
  item,
  onUpdate,
  onDelete,
  submitting,
  editingId,
  setEditingId,
}: {
  item: DeliveryChargeDTO;
  onUpdate: (id: string, values: Partial<DeliveryChargeDTO>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  submitting: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}) {
  const isEditing = editingId === item._id;
  const [local, setLocal] = useState({
    title: item.title,
    charge: item.charge,
  });

  useEffect(() => {
    if (!isEditing) {
      setLocal({ title: item.title, charge: item.charge });
    }
  }, [isEditing, item._id, item.title, item.charge]);

  return (
    <tr className="align-middle">
      <td className="px-3 py-2">
        {isEditing ? (
          <input
            className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/20"
            value={local.title}
            onChange={(e) => setLocal((s) => ({ ...s, title: e.target.value }))}
          />
        ) : (
          <span>{item.title}</span>
        )}
      </td>

      <td className="px-3 py-2">
        {isEditing ? (
          <input
            type="number"
            step="any"
            className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-black/20"
            value={local.charge}
            onChange={(e) => setLocal((s) => ({ ...s, charge: Number(e.target.value) }))}
          />
        ) : (
          <span>{item.charge}</span>
        )}
      </td>

      <td className="px-3 py-2">
        {item.isDeleted ? <Chip color="red">Deleted</Chip> : <Chip color="green">Active</Chip>}
      </td>

      <td className="px-3 py-2">
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="secondary" disabled={submitting} onClick={() => setEditingId(null)}>
              Cancel
            </Button>
            <Button
              disabled={submitting}
              onClick={() =>
                item._id && onUpdate(item._id, { title: local.title, charge: local.charge })
              }
            >
              Save
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditingId(item._id || null)}>
              Edit
            </Button>
            <Button
              variant="ghost"
              disabled={submitting || !item._id}
              onClick={() => item._id && onDelete(item._id)}
            >
              Delete
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}
