"use client";

import React from "react";
import {
  PlusCircle,
  Trash2,
  CheckCircle,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowDownCircle,
  Plus,
} from "lucide-react";
import SimpleEditor from "../../mcq/components/SimpleEditor";

interface Ques {
  question: string;
  options: string[];
  answer: string;
  mark: number;
}

interface FormState {
  passage: string;
  questions: Ques[];
  duration: number;
}

interface PassageFormProps {
  value: FormState;
  setValue: React.Dispatch<React.SetStateAction<FormState>>;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PassageForm({
  value,
  setValue,
  submitting,
  onSubmit,
  onCancel,
}: PassageFormProps) {

  /* ---------------- HELPERS ---------------- */
  const updateQ = (i: number, field: keyof Ques, val: any) => {
    const updated = [...value.questions];
    // @ts-ignore
    updated[i][field] = val;
    setValue((f) => ({ ...f, questions: updated }));
  };

  const addQuestion = () => {
    setValue((f) => ({
      ...f,
      questions: [
        ...f.questions,
        {
          question: "",
          options: ["", ""], // ✅ minimum 2 options
          answer: "",
          mark: 1,
        },
      ],
    }));
  };

  const removeQuestion = (i: number) => {
    if (value.questions.length <= 1) return;
    setValue((f) => ({
      ...f,
      questions: f.questions.filter((_, idx) => idx !== i),
    }));
  };

  const addOption = (qi: number) => {
    const updated = [...value.questions];
    updated[qi].options.push("");
    setValue((f) => ({ ...f, questions: updated }));
  };

  const removeOption = (qi: number, oi: number) => {
    const updated = [...value.questions];
    const removed = updated[qi].options[oi];

    if (updated[qi].options.length <= 2) return; // ✅ min 2 required

    updated[qi].options = updated[qi].options.filter((_, i) => i !== oi);

    if (removed === updated[qi].answer) {
      updated[qi].answer = "";
    }

    setValue((f) => ({ ...f, questions: updated }));
  };

  const isFormValid = () => {
    return value.questions.every((q) => {
      const filledOptions = q.options.filter((o) => o.trim() !== "");
      return (
        filledOptions.length >= 2 &&
        filledOptions.includes(q.answer) &&
        q.question.trim() !== ""
      );
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 max-h-[90vh] overflow-y-auto pr-4 custom-scrollbar p-2">

      {/* -------- PASSAGE -------- */}
      <section className="bg-white rounded-[40px] border-2 border-slate-100 overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-8 py-5 border-b flex justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-indigo-600" />
            <span className="text-xs font-black uppercase text-slate-500">
              Master Passage
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="text-amber-500" />
            <input
              type="number"
              className="w-16 font-black text-lg"
              value={value.duration}
              onChange={(e) =>
                setValue((f) => ({ ...f, duration: Number(e.target.value) }))
              }
            />
            <span className="text-xs font-bold">Minutes</span>
          </div>
        </div>

        <SimpleEditor
          value={value.passage}
          onChange={(v) => setValue((f) => ({ ...f, passage: v }))}
        />
      </section>

      {/* -------- QUESTIONS -------- */}
      {value.questions.map((q, i) => (
        <div
          key={i}
          className="bg-white border-2 border-slate-100 rounded-[48px] p-10"
        >
          {/* Header */}
          <div className="flex justify-between mb-6">
            <h3 className="font-black">Question {i + 1}</h3>
            {value.questions.length > 1 && (
              <button onClick={() => removeQuestion(i)} className="text-red-500">
                <Trash2 />
              </button>
            )}
          </div>

          <SimpleEditor
            value={q.question}
            onChange={(v) => updateQ(i, "question", v)}
          />

          {/* OPTIONS */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {q.options.map((op, oi) => (
              <div key={oi} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black">
                    Option {String.fromCharCode(65 + oi)}
                  </span>
                  {q.options.length > 2 && (
                    <button
                      onClick={() => removeOption(i, oi)}
                      className="text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <SimpleEditor
                  value={op}
                  onChange={(v) => {
                    const updated = [...q.options];
                    updated[oi] = v;
                    updateQ(i, "options", updated);
                  }}
                />

                <button
                  onClick={() => updateQ(i, "answer", op)}
                  className={`flex items-center gap-2 text-xs font-bold mt-2 ${
                    q.answer === op ? "text-green-600" : "text-slate-400"
                  }`}
                >
                  <CheckCircle size={14} />
                  Mark as Correct
                </button>
              </div>
            ))}
          </div>

          {/* ADD OPTION */}
          <button
            onClick={() => addOption(i)}
            className="mt-6 flex items-center gap-2 text-indigo-600 font-bold"
          >
            <Plus size={18} /> Add Option
          </button>

          {/* MARK */}
          <div className="mt-10">
            <label className="text-xs font-black text-amber-600 uppercase">
              Marks
            </label>
            <input
              type="number"
              className="w-32 p-3 rounded-xl border font-black"
              value={q.mark}
              onChange={(e) => updateQ(i, "mark", Number(e.target.value))}
            />
          </div>
        </div>
      ))}

      {/* ADD QUESTION */}
      <button
        onClick={addQuestion}
        className="w-full py-12 border-4 border-dashed rounded-[40px] text-slate-400 hover:text-indigo-600"
      >
        <PlusCircle size={36} /> Add New Question
      </button>

      {/* FOOTER */}
      <div className="sticky bottom-0 bg-white py-6 flex justify-between">
        <button onClick={onCancel} className="font-black text-slate-400">
          Cancel
        </button>

        <button
          onClick={onSubmit}
          disabled={!isFormValid() || submitting}
          className="px-14 py-4 bg-indigo-600 text-white rounded-2xl font-black disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
