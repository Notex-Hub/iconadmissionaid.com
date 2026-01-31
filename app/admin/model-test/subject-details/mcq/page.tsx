"use client";
import React, { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { toast } from "@/hooks/use-toast";
import MCQCard from "./components/MCQCard";
import Modal from "./components/Modal";
import MCQForm from "./components/MCQForm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
const SUBJECTS_URL = `${API_BASE_URL}/model-test-subject`;
const MCQ_URL = `${API_BASE_URL}/model-test-mcq`;
const INSERT_BY_ID = "68303aee6b081dd0f09ac34c";
function MCQPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const queryClient = useQueryClient();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [editingMCQ, setEditingMCQ] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explaination: "",
    tags: "",
    subject: "",
  });

  const notify = {
    success: (msg: string) => toast({ title: "Success", description: msg }),
    error: (msg: string) =>
      toast({ title: "Error", description: msg, variant: "destructive" }),
  };

  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await axiosInstance.get(SUBJECTS_URL);
      return res.data.data;
    },
  });

  const currentSubject = useMemo(
    () => subjectsQuery.data?.find((s: any) => s.slug === slug) || null,
    [subjectsQuery.data, slug]
  );

  const mcqQuery = useQuery({
    queryKey: ["mcqs"],
    queryFn: async () => {
      const res = await axiosInstance.get(MCQ_URL);
      return res.data.data;
    },
  });

  const mcqsForSubject = useMemo(() => {
    if (!currentSubject || !mcqQuery.data) return [];
    return mcqQuery.data.filter(
      (q: any) => q.subjectId?._id === currentSubject._id
    );
  }, [mcqQuery.data, currentSubject]);

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axiosInstance.post("/api/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.url;
      if (url) setCoverPhotoUrl(url);
      notify.success("Image uploaded successfully");
    } catch {
      notify.error("Error uploading image");
    }
  };

  const saveMCQ = useMutation({
    mutationFn: async () => {
      if (!currentSubject) throw new Error("Subject not found");
      const payload = {
        subjectId: currentSubject._id,
        question: newQuestion.question,
        questionImg: coverPhotoUrl || "",
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer,
        explaination: newQuestion.explaination,
        tags: newQuestion.tags.split(",").map((t) => t.trim()),
        subject: newQuestion.subject,
        insertBy: INSERT_BY_ID,
      };

      if (editingMCQ) {
        const res = await axiosInstance.patch(
          `${MCQ_URL}/${editingMCQ._id}`,
          payload
        );
        return res.data;
      } else {
        const res = await axiosInstance.post(`${MCQ_URL}/create-mcq`, payload);
        return res.data;
      }
    },
    onSuccess: () => {
      notify.success(
        editingMCQ ? "MCQ updated successfully!" : "MCQ created successfully!"
      );
      queryClient.invalidateQueries({ queryKey: ["mcqs"] });
      setModalOpen(false);
      setEditingMCQ(null);
      setCoverPhotoUrl("");
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explaination: "",
        tags: "",
        subject: "",
      });
    },
    onError: (err: any) => notify.error(err?.message || "Failed to save MCQ"),
  });

  const deleteMCQ = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`${MCQ_URL}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      notify.success("MCQ deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["mcqs"] });
    },
    onError: (err: any) => notify.error(err?.message || "Failed to delete MCQ"),
  });

  const openEditModal = (mcq: any) => {
    setEditingMCQ(mcq);
    setCoverPhotoUrl(mcq.questionImg || "");
    setNewQuestion({
      question: mcq.question,
      options: mcq.options,
      correctAnswer: mcq.correctAnswer,
      explaination: mcq.explaination,
      tags: mcq.tags.join(", "),
      subject: mcq.subject,
    });
    setModalOpen(true);
  };

  if (!currentSubject)
    return <div className="p-6 text-gray-700">Subject not found.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          MCQs for {currentSubject.title}
        </h1>
     <div className="flex gap-5">
         <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-black rounded"
        >
          Back
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-500 text-white font-semibold rounded shadow hover:from-blue-600 hover:to-blue-600 transition"
        >
          Create MCQ
        </button>
     </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mcqsForSubject.map((q: any, idx: number) => (
          <MCQCard
            key={q._id}
            mcq={q}
            index={idx}
            onEdit={openEditModal}
            onDelete={(id: string) => deleteMCQ.mutate(id)}
          />
        ))}
      </div>

      <Modal
        open={modalOpen}
        title={editingMCQ ? "Edit MCQ" : "Create New MCQ"}
        onClose={() => setModalOpen(false)}
      >
        <MCQForm
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          // setCoverPhotoUrl={setCoverPhotoUrl}
          onSubmit={() => saveMCQ.mutate()}
          onCancel={() => setModalOpen(false)}
          editingMCQ={editingMCQ}
        />
      </Modal>
    </div>
  );
}

export default function MCQPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <MCQPageContent />
    </Suspense>
  );
}
