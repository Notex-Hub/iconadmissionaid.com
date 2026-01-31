"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { toast } from "@/hooks/use-toast";
import PassageCard from "./components/PassageCard";
import Modal from "./components/Modal";
import PassageForm from "./components/PassageForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
const SUBJECTS_URL = `${API_BASE_URL}/model-test-subject`;
const PASSAGE_URL = `${API_BASE_URL}/model-test-passaege`;
const CREATED_BY = "68303aee6b081dd0f09ac34c";

const notify = {
  success: (msg: string) => toast({ title: "Success", description: msg }),
  error: (msg: string) =>
    toast({ title: "Error", description: msg, variant: "destructive" }),
};

function PassagePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug") ?? "";

  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  // form state
  const [form, setForm] = useState({
    passage: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        answer: "",
        mark: 1,
      },
    ],
    duration: 5,
  });

  // fetch subjects
  const subjectsQ = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await axiosInstance.get(SUBJECTS_URL);
      return res.data.data;
    },
  });

  // find current subject
  const currentSubject = useMemo(() => {
    return subjectsQ.data?.find((s: any) => s.slug === slug) ?? null;
  }, [subjectsQ.data, slug]);

  // fetch passages
  const passagesQ = useQuery({
    queryKey: ["passages", currentSubject?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(PASSAGE_URL);
      return res.data.data.filter(
        (p: any) => p.subjectId === currentSubject?._id
      );
    },
    enabled: !!currentSubject,
  });

  // CREATE / UPDATE
  const savePassage = useMutation({
    mutationFn: async () => {
      if (!currentSubject) throw new Error("Subject not found");

      const payload: any = {
        subjectId: currentSubject._id,
        createdBy: CREATED_BY,
        passage: form.passage,
        questions: form.questions,
        duration: form.duration,
      };

      let res;

      if (editing) {
        res = await axiosInstance.patch(
          `${PASSAGE_URL}/${editing._id}`,
          payload
        );
      } else {
        res = await axiosInstance.post(`${PASSAGE_URL}/create`, payload);
      }

      return res.data;
    },
    onSuccess: () => {
      notify.success(editing ? "Passage updated" : "Passage created");
      setModalOpen(false);
      setEditing(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["passages"] });
    },
    onError: (err: any) => notify.error(err?.message || "Failed to save"),
  });

  // DELETE
  const deletePassage = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`${PASSAGE_URL}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      notify.success("Passage deleted");
      queryClient.invalidateQueries({ queryKey: ["passages"] });
    },
    onError: (err: any) => notify.error(err?.message || "Failed to delete"),
  });

  // reset form
  const resetForm = () => {
    setForm({
      passage: "",
      duration: 5,
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
          mark: 1,
        },
      ],
    });
  };

  // open create
  const openCreate = () => {
    setEditing(null);
    resetForm();
    setModalOpen(true);
  };

  // open edit
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      passage: item.passage || "",
      duration: item.duration || 5,
      questions: item.questions || [],
    });
    setModalOpen(true);
  };

  if (subjectsQ.isLoading || passagesQ.isLoading) {
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
              Passage — {currentSubject.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Showing all passages for{" "}
              <span className="font-medium">{currentSubject.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-black rounded"
            >
              Back
            </button>

            <button
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["passages"] });
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
              }}
              className="px-3 py-1 border rounded"
            >
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Create Passage
            </button>
          </div>
        </div>

        {/* list */}
        <div className="space-y-4">
          {passagesQ.data?.length === 0 ? (
            <div className="bg-white p-6 rounded shadow text-center text-gray-500">
              No passage found for this subject.
            </div>
          ) : (
            passagesQ.data.map((p: any, idx: number) => (
              <PassageCard
                key={p._id}
                passage={p}
                index={idx}
                onEdit={() => openEdit(p)}
                onDelete={() => {
                  if (confirm("Delete this passage?"))
                    deletePassage.mutate(p._id);
                }}
              />
            ))
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? "Edit Passage" : "Create Passage"}
        onClose={() => setModalOpen(false)}
      >
        <PassageForm
          value={form}
          setValue={setForm}
          onCancel={() => setModalOpen(false)}
          onSubmit={() => savePassage.mutate()}
          submitting={savePassage.isPending}
        />
      </Modal>
    </div>
  );
}

export default function PassagePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PassagePageContent />
    </Suspense>
  );
}
