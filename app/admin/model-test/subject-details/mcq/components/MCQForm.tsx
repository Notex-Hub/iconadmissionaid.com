"use client";

import React, { useState } from "react";
import SimpleEditor from "./SimpleEditor";
import {
  CheckCircle2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Save,
  X,
  FileText,
  Info,
  LucideStopCircle,
} from "lucide-react";

interface MCQFormProps {
  newQuestion: any;
  setNewQuestion: (question: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingMCQ?: boolean;
}

export default function MCQForm({
  newQuestion,
  setNewQuestion,
  onSubmit,
  onCancel,
  editingMCQ,
}: MCQFormProps) {
  const [step, setStep] = useState(1);

  /* -------------------- VALIDATION -------------------- */
  const isOptionsValid = () => {
    const filledOptions = newQuestion.options.filter(
      (opt: string) => opt.trim() !== ""
    );

    return (
      filledOptions.length >= 2 &&
      filledOptions.includes(newQuestion.correctAnswer)
    );
  };

  /* -------------------- OPTION HANDLERS -------------------- */
  const updateOptionText = (index, val) => {
    const updatedOptions = [...newQuestion.options];
    const wasCorrect = updatedOptions[index] === newQuestion.correctAnswer;

    updatedOptions[index] = val;

    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
      correctAnswer: wasCorrect ? val : newQuestion.correctAnswer,
    });
  };

  const removeOption = (index) => {
    const removed = newQuestion.options[index];
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);

    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
      correctAnswer:
        removed === newQuestion.correctAnswer
          ? ""
          : newQuestion.correctAnswer,
    });
  };

  /* -------------------- SUGGESTIONS -------------------- */
  const subjectSuggestions = [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "ICT",
    "English",
    "Bangla",
    "General Knowledge",
    "logical reasoning",
    "logical reasoning",
    "Current Affairs",
    "Economics",
    "History",
    "Geography",
    "higher math",
    "general science",
    "accounting",
    "business studies",
    "civics",
    "political science",
    "social science",
    
  ];

  const tagSuggestions = [
    "MCQ",
    "Model Test",
    "Admission",
    "BCS",
    "HSC",
    "SSC",
    "Exam",
    "Practice",
    "Test",
    "Quiz",
    "Subjective",
    "Objective",
    "Multiple Choice",
    "Study",
    "Preparation",
    "Education",
    "Learning",
    "Assessment",
    "Revision",
    "Question Bank",
    
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* -------------------- HEADER -------------------- */}
        <div className="px-8 py-6 border-b flex justify-between bg-slate-50">
          <div className="flex gap-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {s}
              </div>
            ))}
          </div>

          <button onClick={onCancel}>
            <X />
          </button>
        </div>

        {/* -------------------- CONTENT -------------------- */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="flex items-center gap-3">
                <FileText className="text-indigo-600" />
                <h2 className="text-xl font-semibold">Question</h2>
              </div>

              <SimpleEditor
                value={newQuestion.question}
                onChange={(v) =>
                  setNewQuestion({ ...newQuestion, question: v })
                }
              />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <LucideStopCircle className="text-indigo-600" />
                  <h2 className="text-xl font-semibold">Options</h2>
                </div>

                <button
                  onClick={() =>
                    setNewQuestion({
                      ...newQuestion,
                      options: [...newQuestion.options, ""],
                    })
                  }
                  className="text-indigo-600 font-semibold"
                >
                  + Add Option
                </button>
              </div>

              {newQuestion.options.map((opt, i) => {
                const isCorrect =
                  opt !== "" && opt === newQuestion.correctAnswer;

                return (
                  <div
                    key={i}
                    className={`flex gap-4 items-center p-4 border rounded-xl ${
                      isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setNewQuestion({
                          ...newQuestion,
                          correctAnswer: opt,
                        })
                      }
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-slate-100"
                      }`}
                    >
                      <CheckCircle2 />
                    </button>

                    <div className="flex-1">
                      <SimpleEditor
                        value={opt}
                        onChange={(v) => updateOptionText(i, v)}
                      />
                    </div>

                    <button onClick={() => removeOption(i)}>
                      <Trash2 className="text-red-500" />
                    </button>
                  </div>
                );
              })}

              {!isOptionsValid() && (
                <p className="text-sm text-red-500">
                  ⚠ Minimum 2 options required & correct answer must be selected
                </p>
              )}
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <div className="flex items-center gap-3">
                <Info className="text-indigo-600" />
                <h2 className="text-xl font-semibold">Explanation</h2>
              </div>

              <SimpleEditor
                value={newQuestion.explaination}
                onChange={(v) =>
                  setNewQuestion({ ...newQuestion, explaination: v })
                }
              />

              {/* SUBJECT */}
              <input
                list="subjects"
                placeholder="Subject"
                className="w-full border rounded-xl px-4 py-3"
                value={newQuestion.subject}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, subject: e.target.value })
                }
              />
              <datalist id="subjects">
                {subjectSuggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>

              {/* TAG */}
              <input
                list="tags"
                placeholder="Tags (comma separated)"
                className="w-full border rounded-xl px-4 py-3"
                value={newQuestion.tags}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, tags: e.target.value })
                }
              />
              <datalist id="tags">
                {tagSuggestions.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </>
          )}
        </div>

        {/* -------------------- FOOTER -------------------- */}
        <div className="px-8 py-6 border-t flex justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="text-slate-500 flex"
          >
            <ArrowLeft /> Back
          </button>

          {step < 3 ? (
            <button
              disabled={step === 2 && !isOptionsValid()}
              onClick={() => setStep(step + 1)}
              className={`px-6 flex py-3 rounded-md ${
                step === 2 && !isOptionsValid()
                  ? "bg-slate-300"
                  : "bg-indigo-600 text-white"
              }`}
            >
              Continue <ArrowRight />
            </button>
          ) : (
            <button
              disabled={!isOptionsValid()}
              onClick={onSubmit}
              className={`px-8 py-3 rounded-md ${
                !isOptionsValid()
                  ? "bg-slate-300"
                  : "bg-green-600 text-white"
              }`}
            >
              <Save /> {editingMCQ ? "Update MCQ" : "Save MCQ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
