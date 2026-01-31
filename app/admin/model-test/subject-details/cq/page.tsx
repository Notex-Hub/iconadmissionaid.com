// Optional: uncomment if you want to force dynamic (disable SSR/prerender)
// export const dynamic = "force-dynamic";

"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  ArrowLeft,
  RefreshCw,
  Edit3,
  Trash2,
  Clock,
  Award,
  FileText,
  Calendar,
  Search,
} from "lucide-react";
import SimpleEditor from "../mcq/components/SimpleEditor";
// Import your Editor here (e.g., SimpleEditor or Jodit)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
const SUBJECTS_URL = `${API_BASE_URL}/model-test-subject`;
const CQ_URL = `${API_BASE_URL}/model-test-cq`;
const INSERT_BY_ID = "68303aee6b081dd0f09ac34c";

function CQPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug") || "";
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCQ, setEditingCQ] = useState<any | null>(null);
  const [form, setForm] = useState({ question: "", mark: 5, duration: 120 });

  // Queries
  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: async () =>
      (await axiosInstance.get(SUBJECTS_URL)).data?.data ?? [],
  });

  const cqsQuery = useQuery({
    queryKey: ["cqs"],
    queryFn: async () => (await axiosInstance.get(CQ_URL)).data?.data ?? [],
  });

  const currentSubject = useMemo(
    () => subjectsQuery.data?.find((s: any) => s.slug === slug) ?? null,
    [subjectsQuery.data, slug]
  );

  const cqsForSubject = useMemo(() => {
    if (!currentSubject || !cqsQuery.data) return [];
    return cqsQuery.data.filter((cq: any) => {
      // subjectId might be an object reference
      const sid = cq.subjectId?._id ?? cq.subjectId;
      return sid === currentSubject._id;
    });
  }, [cqsQuery.data, currentSubject]);

  // Mutations
  const saveCQ = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        subjectId: currentSubject._id,
        createdBy: INSERT_BY_ID,
      };
      return editingCQ
        ? axiosInstance.patch(`${CQ_URL}/${editingCQ._id}`, payload)
        : axiosInstance.post(`${CQ_URL}/create`, payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: editingCQ ? "CQ Updated" : "CQ Created",
      });
      queryClient.invalidateQueries({ queryKey: ["cqs"] });
      setModalOpen(false);
    },
  });

  const deleteCQ = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`${CQ_URL}/${id}`),
    onSuccess: () => {
      toast({ title: "Deleted", description: "CQ removed successfully" });
      queryClient.invalidateQueries({ queryKey: ["cqs"] });
    },
  });

  if (!currentSubject)
    return <div className="p-10 text-center">Loading Subject...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Premium Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className=" mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {currentSubject.title}{" "}
                <span className="text-indigo-600">CQ Bank</span>
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {slug}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            <button 
              onClick={() => { subjectsQuery.refetch(); cqsQuery.refetch(); }}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => {
                setEditingCQ(null);
                setForm({ question: "", mark: 5, duration: 120 });
                setModalOpen(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus size={20} /> Create New CQ
            </button>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-6 mt-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<FileText className="text-blue-500" />}
            label="Total Questions"
            value={cqsForSubject.length}
          />
          <StatCard
            icon={<Award className="text-emerald-500" />}
            label="Avg. Marks"
            value="5.0"
          />
          <StatCard
            icon={<Clock className="text-amber-500" />}
            label="Avg. Duration"
            value="120s"
          />
        </div>

        {/* List View */}
        <div className="space-y-4">
          {cqsForSubject.length === 0 ? (
            <div className="bg-white rounded-[32px] p-20 text-center border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-slate-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">
                No Questions Yet
              </h3>
              <p className="text-slate-400 text-sm">
                Start by creating your first creative question.
              </p>
            </div>
          ) : (
            cqsForSubject.map((cq: any, idx: number) => (
              <CQCard
                key={cq._id}
                cq={cq}
                index={idx}
                onEdit={() => {
                  setEditingCQ(cq);
                  setForm({
                    question: cq.question,
                    mark: cq.mark,
                    duration: cq.duration,
                  });
                  setModalOpen(true);
                }}
                onDelete={() => {
                  if (confirm("Delete?")) deleteCQ.mutate(cq._id);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 ">
                {editingCQ ? "UPDATE" : "CREATE"}{" "}
                <span className="text-indigo-600">CQ</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-light"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">
                  Question Content
                </label>
                <div className="border-2 border-slate-100 rounded-[24px] overflow-hidden focus-within:border-indigo-500 transition-all">
                  <SimpleEditor
                    value={form.question}
                    onChange={(val: string) =>
                      setForm((s) => ({ ...s, question: val }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Points / Mark"
                  value={form.mark}
                  icon={<Award size={16} />}
                  onChange={(v:any) => setForm((s) => ({ ...s, mark: v }))}
                />
                <InputGroup
                  label="Duration (Sec)"
                  value={form.duration}
                  icon={<Clock size={16} />}
                  onChange={(v:any) => setForm((s) => ({ ...s, duration: v }))}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveCQ.mutate()}
                  className="flex-1 py-4 rounded-md font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  {saveCQ.isPending ? "Saving..." : "Save Question"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* UI Helper Components */

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-5 rounded-md border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function CQCard({ cq, index, onEdit, onDelete }: any) {
  return (
    <div className="group bg-white border border-slate-200 rounded-md p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              {index + 1}
            </span>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={12} />
              {new Date(cq.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div
            className="text-lg font-bold text-slate-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: cq.question }}
          />
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              <Award size={12} /> {cq.mark} Marks
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              <Clock size={12} /> {cq.duration}s
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-all"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, value, icon, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          type="number"
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-11 pr-4 py-3.5 focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default function CQPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <CQPageContent />
    </Suspense>
  );
}
