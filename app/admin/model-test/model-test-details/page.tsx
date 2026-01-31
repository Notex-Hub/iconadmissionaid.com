"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
const SUBJECTS_URL = `${API_BASE_URL}/model-test-subject`;
const MODELS_URL = `${API_BASE_URL}/model-test`;

/* --- Modal component (simple) --- */
function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 px-2"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

/* --- Main page --- */
function ModelTestDetailsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const slug = searchParams.get("slug") || "";

  const notify = {
    success: (msg: string) => toast({ title: "Success", description: msg }),
    error: (msg: string) =>
      toast({ title: "Error", description: msg, variant: "destructive" }),
  };

  // fetch subjects
  const subjectsQuery = useQuery({
    queryKey: ["modelTestSubjects"],
    queryFn: async () => {
      const res = await axiosInstance.get(SUBJECTS_URL);
      return res.data;
    },
  });

  // fetch model tests (to map slug -> id and allow selection)
  const modelTestsQuery = useQuery({
    queryKey: ["modelTests"],
    queryFn: async () => {
      const res = await axiosInstance.get(MODELS_URL);
      return res.data;
    },
  });

  const subjectsForModelTest = useMemo(() => {
    const all = subjectsQuery.data?.data ?? [];
    if (!slug) return [];
    return all.filter((s: any) => s?.modelTest?.slug === slug);
  }, [subjectsQuery.data, slug]);

  const modelTestInfo = useMemo(() => {
    const allModels = modelTestsQuery.data?.data ?? [];
    return allModels.find((m: any) => m.slug === slug) ?? null;
  }, [modelTestsQuery.data, slug]);

  // mutations
  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const res = await axiosInstance.post(
        `${SUBJECTS_URL}/create-subject`,
        payload
      );
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["modelTestSubjects"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, any>;
    }) => {
      const res = await axiosInstance.patch(`${SUBJECTS_URL}/${id}`, payload);
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["modelTestSubjects"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`${SUBJECTS_URL}/${id}`);
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["modelTestSubjects"] }),
  });

  // modal state & form
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingSubject, setEditingSubject] = useState<any | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formModelTestId, setFormModelTestId] = useState<string | null>(null);

  // open create modal
  const openCreateModal = () => {
    setModalMode("create");
    setEditingSubject(null);
    setFormTitle("");
    // preselect modelTest if we are in a model-test details page
    setFormModelTestId(modelTestInfo?._id ?? null);
    setModalOpen(true);
  };

  // open edit modal with subject prefilled
  const openEditModal = (subject: any) => {
    setModalMode("edit");
    setEditingSubject(subject);
    setFormTitle(subject.title ?? "");
    setFormModelTestId(subject.modelTest?._id ?? null);
    setModalOpen(true);
  };

  // submit create or edit
  const handleModalSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const title = formTitle.trim();
    const modelTestId = formModelTestId;
    if (!title) {
      notify.error("Please provide title");
      return;
    }
    if (!modelTestId) {
      notify.error("Please select a Model Test");
      return;
    }

    try {
      if (modalMode === "create") {
        const payload = { title, modelTest: modelTestId };
        const res = await createMutation.mutateAsync(payload);
        if (!res?.status) {
          notify.error(res?.message || "Create failed");
        } else {
          notify.success("Subject created");
          setModalOpen(false);
        }
      } else if (modalMode === "edit" && editingSubject) {
        const payload = { title, modelTest: modelTestId };
        const res = await updateMutation.mutateAsync({
          id: editingSubject.slug,
          payload,
        });
        if (!res?.status) {
          notify.error(res?.message || "Update failed");
        } else {
          notify.success("Subject updated");
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message || err?.message || "Operation failed"
      );
    }
  };

  // delete
  const handleDelete = async (subject: any) => {
    if (!confirm(`Delete subject "${subject.title}"?`)) return;
    try {
      const res = await deleteMutation.mutateAsync(subject._id);
      if (!res?.status) {
        notify.error(res?.message || "Delete failed");
      } else {
        notify.success("Subject deleted");
      }
    } catch (err: any) {
      notify.error(
        err?.response?.data?.message || err?.message || "Delete failed"
      );
    }
  };

  // simple loading / error
  const loading = subjectsQuery.isLoading || modelTestsQuery.isLoading;
  const error = subjectsQuery.error ?? modelTestsQuery.error;

  // convenience: model test options list
  const modelTestOptions = modelTestsQuery.data?.data ?? [];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className=" mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Model Test Subjects
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              slug: <span className="font-mono">{slug || "—"}</span>
            </p>
            {modelTestInfo && (
              <div className="mt-2 text-sm text-gray-600">
                <strong>{modelTestInfo.title}</strong>{" "}
                <span className="text-xs text-gray-500">
                  ({modelTestInfo.university})
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              ← Back
            </button>

            <button
              onClick={() => {
                subjectsQuery.refetch();
                modelTestsQuery.refetch();
              }}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
            >
              Refresh
            </button>

            <button
              onClick={openCreateModal}
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Create Subject
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded shadow text-center text-sm text-gray-600">
            Loading…
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded shadow text-center text-sm text-red-600">
            Error loading data: {(error as any)?.message ?? "unknown"}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Model Test
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {subjectsForModelTest.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No subjects found for this model test.
                    </td>
                  </tr>
                ) : (
                  subjectsForModelTest.map((sub: any, idx: number) => (
                    <tr key={sub._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/model-test/subject-details?slug=${sub.slug}`}
                        >
                          <div className="font-medium text-gray-900">
                            {sub.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {sub.slug}
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {sub.slug}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {sub.modelTest?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {sub.isDeleted ? (
                          <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-100">
                            Deleted
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sm flex gap-2 justify-end">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sub)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for create/edit */}
      <Modal
        open={modalOpen}
        title={modalMode === "create" ? "Create Subject" : "Edit Subject"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleModalSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 text-sm"
              placeholder="English"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model Test
            </label>
            <select
              value={formModelTestId ?? ""}
              onChange={(e) => setFormModelTestId(e.target.value ?? null)}
              className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="" disabled>
                Select model test
              </option>
              {modelTestOptions.map((m: any) => (
                <option key={m._id} value={m._id}>
                  {m.title} — {m.university}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-400 mt-1">
              If you opened this page from a model-test, it is preselected.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3 py-2 border rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
            >
              {modalMode === "create"
                ? createMutation.isPending
                  ? "Creating..."
                  : "Create"
                : updateMutation.isPending
                ? "Updating..."
                : "Update"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function ModelTestDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ModelTestDetailsPageContent />
    </Suspense>
  );
}
