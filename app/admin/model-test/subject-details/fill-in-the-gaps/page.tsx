"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { toast } from "@/hooks/use-toast";
import GapCard from "./components/GapCard";
import Modal from "./components/Modal";
import GapForm from "./components/GapForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
const SUBJECTS_URL = `${API_BASE_URL}/model-test-subject`;
const GAPS_URL = `${API_BASE_URL}/model-test-gaps`;
const CREATED_BY = "68303aee6b081dd0f09ac34c";

const notify = {
  success: (msg: string) => toast({ title: "Success", description: msg }),
  error: (msg: string) =>
    toast({ title: "Error", description: msg, variant: "destructive" }),
};

function GapsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug") ?? "";

  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGap, setEditingGap] = useState<any | null>(null);

  // form state
  const [form, setForm] = useState({
    question: "",
    answers: [""],
    duration: 1,
    mark: 1,
  });

  // fetch subjects
  const subjectsQ = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await axiosInstance.get(SUBJECTS_URL);
      return res.data.data;
    },
  });

  // current subject by slug
  const currentSubject = useMemo(() => {
    return subjectsQ.data?.find((s: any) => s.slug === slug) ?? null;
  }, [subjectsQ.data, slug]);

  // fetch all gaps
  const gapsQ = useQuery({
    queryKey: ["gaps"],
    queryFn: async () => {
      const res = await axiosInstance.get(GAPS_URL);
      return res.data.data;
    },
  });

  // filter by subject
  const gapsForSubject = useMemo(() => {
    if (!currentSubject || !gapsQ.data) return [];
    return gapsQ.data.filter(
      (g: any) => g.subjectId?._id === currentSubject._id
    );
  }, [gapsQ.data, currentSubject]);

  // create / update
  const saveGap = useMutation({
    mutationFn: async () => {
      if (!currentSubject) throw new Error("Subject not found");
      const payload: any = {
        subjectId: currentSubject._id,
        createdBy: CREATED_BY,
        question: form.question,
        duration: form.duration,
        mark: form.mark,
        answers: form.answers,
      };

      if (editingGap) {
        const res = await axiosInstance.patch(
          `${GAPS_URL}/${editingGap._id}`,
          payload
        );
        return res.data;
      } else {
        const res = await axiosInstance.post(
          `${GAPS_URL}/create-testgapquestion`,
          payload
        );
        return res.data;
      }
    },
    onSuccess: () => {
      notify.success(editingGap ? "Gap updated" : "Gap created");
      setModalOpen(false);
      setEditingGap(null);
      setForm({ question: "", answers: [""], duration: 1, mark: 1 });
      queryClient.invalidateQueries({ queryKey: ["gaps"] });
    },
    onError: (err: any) => notify.error(err?.message || "Failed to save"),
  });

  // delete
  const deleteGap = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`${GAPS_URL}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      notify.success("Gap deleted");
      queryClient.invalidateQueries({ queryKey: ["gaps"] });
    },
    onError: (err: any) => notify.error(err?.message || "Failed to delete"),
  });

  // open create modal
  const openCreate = () => {
    setEditingGap(null);
    setForm({ question: "", answers: [""], duration: 1, mark: 1 });
    setModalOpen(true);
  };

  // open edit modal
  const openEdit = (g: any) => {
    setEditingGap(g);
    setForm({
      question: g.question || "",
      answers: Array.isArray(g.answers) ? g.answers : [""],
      duration: g.duration ?? 1,
      mark: g.mark ?? 1,
    });
    setModalOpen(true);
  };

  // guard: subject missing
  if (subjectsQ.isLoading || gapsQ.isLoading) {
    return <div className="p-6">Loading…</div>;
  }
  if (!currentSubject) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded shadow text-sm text-gray-700">
          Subject not found for slug{" "}
          <span className="font-mono">{slug || "—"}</span>.
          <div className="mt-3">
            <button
              onClick={() => router.back()}
              className="px-3 py-1 border rounded"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Fill-in-the-Gaps — {currentSubject.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Showing all gap questions for subject{" "}
              <span className="font-medium">{currentSubject.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
                        <button onClick={() => router.back()} className="px-4 py-2 bg-gray-200 text-black rounded">Back</button>

            <button onClick={() => { queryClient.invalidateQueries({ queryKey: ["subjects"] }); queryClient.invalidateQueries({ queryKey: ["gaps"] }); }}
              className="px-3 py-1 border rounded hover:bg-gray-50"
            >
              Refresh
            </button>
            <button
              onClick={openCreate}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Create Gap
            </button>
          </div>
        </div>

        {/* Gap cards */}
        <div className="grid grid-cols-1 gap-4">
          {gapsForSubject.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-center text-gray-500">
              No gaps found for this subject.
            </div>
          ) : (
            gapsForSubject.map((g: any, idx: number) => (
              <GapCard
                key={g._id}
                gap={g}
                index={idx}
                onEdit={openEdit}
                onDelete={(id) => {
                  if (!confirm("Delete this gap?")) return;
                  deleteGap.mutate(id);
                }}
              />
            ))
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editingGap ? "Edit Gap" : "Create Gap"}
        onClose={() => setModalOpen(false)}
      >
        <GapForm
          value={form}
          setValue={setForm}
          onCancel={() => setModalOpen(false)}
          onSubmit={() => saveGap.mutate()}
          submitting={saveGap.isPending}
        />
      </Modal>
    </div>
  );
}

export default function GapsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <GapsPageContent />
    </Suspense>
  );
}
