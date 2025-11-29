/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useGetAllMcqQuery, useMcqAttempMutation } from "../../../redux/Features/Api/Mcq/McqApi";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";
import { EmptyState } from "../../Components/Dashboard/ExamRun/EmptyState";
import { HeaderBar } from "../../Components/Dashboard/ExamRun/HeaderBar";
import { QuestionCard } from "../../Components/Dashboard/ExamRun/QuestionCard";
import { PaginationControls } from "../../Components/Dashboard/ExamRun/PaginationControls";
import { useGetAllExamQuery } from "../../../redux/Features/Api/Exam/Exam";

const QUESTIONS_PER_PAGE = 10;

const ExamRun = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth || {});
  const { data: examData } = useGetAllExamQuery();
  const exams = examData?.data ?? [];
  const examMeta = useMemo(() => {
    if (!slug) return null;
    const s = String(slug).trim().toLowerCase();
    return exams.find((e) => e?.slug && String(e.slug).trim().toLowerCase() === s) ?? null;
  }, [exams, slug]);

  const { data: mcqData, isLoading, isError } = useGetAllMcqQuery();
  const mcqs = mcqData?.data ?? [];

  const filtered = useMemo(() => {
    if (!slug) return [];
    const s = String(slug).trim().toLowerCase();
    return mcqs.filter((m) => m?.examId?.slug && String(m.examId.slug).trim().toLowerCase() === s);
  }, [mcqs, slug]);

  const [submitMcqAttempt, { isLoading: submitting }] = useMcqAttempMutation();
  const [page, setPage] = useState(1);
  const totalQuestions = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalQuestions / QUESTIONS_PER_PAGE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
  const pageQuestions = filtered.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  // answers: { [questionId]: selectedValue }  (value can be text, number index, or letter A/B/...)
  const [answers, setAnswers] = useState({});
  const handleAnswer = (qid, opt) => setAnswers((prev) => ({ ...prev, [qid]: opt }));

  // progress
  const answeredCount = Object.keys(answers).length;

  // timer
  const durationMinutes = examMeta?.mcqDuration ?? examMeta?.mcq_duration ?? 0;
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes > 0 ? durationMinutes * 60 : 0);
  useEffect(() => {
    if (durationMinutes > 0) setSecondsLeft(durationMinutes * 60);
  }, [durationMinutes, slug]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && durationMinutes > 0) {
      toast.success("সময় শেষ হয়েছে — উত্তরগুলো সাবমিট করা হচ্ছে।");
      handleSubmit(); // auto submit
    }
  }, [secondsLeft]);

  // Helpers to map selected value -> actual option TEXT
  const toOptionText = (q, selectedValue) => {
    if (!q || !Array.isArray(q.options)) return String(selectedValue ?? "");

    const val = selectedValue;

    // Case 1: numeric like 1/2/3/4 (1-based)
    if (!isNaN(Number(val))) {
      const idx = Number(val) - 1;
      if (idx >= 0 && idx < q.options.length) return String(q.options[idx]);
      return String(val);
    }

    // Case 2: single letter A/B/C/D -> map to 0-based
    if (typeof val === "string" && /^[A-Za-z]$/.test(val.trim())) {
      const idx = val.trim().toUpperCase().charCodeAt(0) - 65; // A=0
      if (idx >= 0 && idx < q.options.length) return String(q.options[idx]);
      return String(val);
    }

    // Case 3: already text -> return as is
    return String(val);
  };

  // Build payload and call mcqAttemp endpoint
  const handleSubmit = async () => {
    if (!examMeta) {
      toast.error("এক্সাম পাওয়া যায়নি।");
      return;
    }

    const studentId = userInfo?._id ?? userInfo?.id;
    if (!studentId) {
      navigate(`/exam/${slug}/start`, { state: { redirectTo: `/exam/${slug}/run` } });
      return;
    }

    const answerArray = Object.entries(answers).map(([questionId, selectedValue]) => {
      const q = mcqs.find((m) => String(m._id) === String(questionId));
      // 👉 We always send the ACTUAL OPTION TEXT now
      const selectedAnswer = toOptionText(q, selectedValue);
      return { questionId, selectedAnswer };
    });

    if (answerArray.length === 0) {
      const confirmEmpty = window.confirm("তুমি কোনো প্রশ্ন নির্বাচন করোনি। তবুও সাবমিট করবে?");
      if (!confirmEmpty) return;
    }

    const payload = {
      answer: answerArray,
      studentId,
    };

    try {
      const res = await submitMcqAttempt(payload).unwrap();
      toast.success(res?.message ?? "উত্তর সফলভাবে সাবমিট হয়েছে।");
      navigate(`/exam/${slug}/result`, {
        state: {
          serverResponse: res
        }
      });
    } catch (err) {
      console.error("mcqAttemp submit error:", err);
      const msg = err?.data?.message || err?.error || "সাবমিশনে সমস্যা হয়েছে, পরে চেষ্টা করুন।";
      toast.error(msg);
    }
  };

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>MCQ লোড করতে সমস্যা হয়েছে।</p>
      </div>
    );
  }

  if (!filtered || filtered.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="absolute inset-x-0 top-0 z-50">
          <Navbar />
        </div>
        <main className="container mx-auto px-4 pt-28 pb-12">
          <div className="max-w-3xl mx-auto">
            <EmptyState onBack={handleBack} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-6xl mx-auto">
          <HeaderBar
            title={examMeta?.examTitle ?? "Exam"}
            durationMinutes={durationMinutes}
            secondsLeft={secondsLeft}
            answeredCount={answeredCount}
            totalQuestions={totalQuestions}
          />

          <div className="space-y-6">
            {pageQuestions.map((q, idx) => (
              <div key={q._id}>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Questions ({startIndex + idx + 1}/{totalQuestions} answers)
                </div>

                <QuestionCard
                  q={q}
                  value={answers[q._id] ?? null}
                  onChange={handleAnswer}
                  index={idx}
                  globalIndex={startIndex + idx + 1}
                />
              </div>
            ))}
          </div>

          <PaginationControls page={page} totalPages={totalPages} setPage={setPage} />

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-md bg-white shadow"
            >
              Prev
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-[#c21010] text-white rounded-lg font-medium shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Section"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamRun;
