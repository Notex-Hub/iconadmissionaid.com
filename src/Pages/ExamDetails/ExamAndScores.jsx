/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import  { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";

import { useGetAllExamQuery } from "../../../redux/Features/Api/Exam/Exam";
import { useGetAllmcqAttempQuery } from "../../../redux/Features/Api/Mcq/McqApi";
import TabButton from "../../Components/Dashboard/ExamAndScores/TabButton";
import EmptyScores from "../../Components/Dashboard/ExamAndScores/EmptyScores";
import ScoresSummary from "../../Components/Dashboard/ExamAndScores/ScoresSummary";
import ScoresTable from "../../Components/Dashboard/ExamAndScores/ScoresTable";
import ExamCard from "../../Components/Dashboard/ExamAndScores/ExamCard";

const ExamAndScores = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.auth || {});

 
  const {
    data: examData,
    isLoading: examsLoading,
    isError: examsError,
  } = useGetAllExamQuery();

  // fetch attempts
  const {
    data: attemptsData,
    isLoading: attemptsLoading,
    isError: attemptsError,
  } = useGetAllmcqAttempQuery();

  const [activeTab, setActiveTab] = useState("exam");

  const exams = examData?.data ?? [];
  const attempts = attemptsData?.data ?? [];

  const resolvedExamId = useMemo(() => {
    if (!slug) return null;
    const s = String(slug).trim().toLowerCase();
    const isId = /^[0-9a-fA-F]{24}$/.test(s);
    if (isId) return s;
    const found = exams.find((ex) => {
      if (!ex) return false;
      if (ex.slug && String(ex.slug).trim().toLowerCase() === s) return true;
      if (ex._id && String(ex._id).trim().toLowerCase() === s) return true;
      if (ex.examTitle && String(ex.examTitle).trim().toLowerCase() === s) return true;
      return false;
    });
    return found?._id ?? null;
  }, [exams, slug]);

  const attemptsForExam = useMemo(() => {
    if (!slug) return [];
    const s = String(slug).trim().toLowerCase();
    return attempts.filter((a) => {
      const ex = a?.examId ?? {};
      if (!ex) return false;
      if (resolvedExamId && ex._id && String(ex._id).trim().toLowerCase() === String(resolvedExamId).trim().toLowerCase()) return true;
      if (ex.slug && String(ex.slug).trim().toLowerCase() === s) return true;
      if (ex.examTitle && String(ex.examTitle).trim().toLowerCase() === s) return true;
      if (ex._id && String(ex._id).trim().toLowerCase() === s) return true;
      return false;
    });
  }, [attempts, slug, resolvedExamId]);

  const totalAttempts = attemptsForExam.length;

  const yourAttempts = useMemo(() => {
    if (!userInfo) return 0;
    const uid = userInfo._id ?? userInfo.id;
    return attemptsForExam.filter((a) => String(a?.studentId?._id) === String(uid)).length;
  }, [attemptsForExam, userInfo]);

  const filteredExams = useMemo(() => {
    const list = exams ?? [];
    if (!slug) return list.filter((e) => e?.status === "published");
    const s = String(slug).trim().toLowerCase();
    return list.filter((e) => e?.slug && String(e.slug).trim().toLowerCase() === s);
  }, [exams, slug]);

  const handleStart = (exam) => {
    if (!userInfo) {
      navigate(`/exam/${exam.slug}/start`, { state: { redirectTo: `/exam/${exam.slug}/run` } });
      return;
    }
    navigate(`/exam/${exam.slug}/run`);
  };

const handleViewAttempt = (attemptId, examSlugFromAttempt) => {
  const fallbackSlug = slug ?? examSlugFromAttempt ?? ""; 
  const finalSlug = String(examSlugFromAttempt || fallbackSlug || "").trim();
  if (!finalSlug) {
    console.warn("No exam slug available for navigation", { attemptId, examSlugFromAttempt, fallbackSlug });
    return;
  }
  navigate(`/exam/${encodeURIComponent(finalSlug)}/result/${encodeURIComponent(attemptId)}`, {
    state: { attemptId, from: "scores" },
  });
};


  const handleBack = () => navigate(-1);
  if (examsLoading || attemptsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (examsError || attemptsError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>লোড করতে সমস্যা হয়েছে।</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc]">
      <div className="absolute inset-x-0 top-0 z-50"><Navbar /></div>
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex rounded-lg overflow-hidden bg-transparent shadow-sm mb-6">
            <TabButton active={activeTab === "exam"} onClick={() => setActiveTab("exam")}>Exam</TabButton>
            <TabButton active={activeTab === "scores"} onClick={() => setActiveTab("scores")}>Scores</TabButton>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Available Exams</h1>
          <p className="text-sm text-gray-500 mb-6">Select an exam to begin your assessment</p>
        </div>
        <section className="space-y-6">
          {activeTab === "exam" && (
            <>
              {filteredExams.length === 0 ? (
                <div className="text-center text-gray-600 py-12">
                  <p>কোনো এক্সাম পাওয়া যায়নি।</p>
                </div>
              ) : (
                filteredExams.map((ex) => <ExamCard key={ex._id} exam={ex} onStart={handleStart} />)
              )}
            </>
          )}

          {activeTab === "scores" && (
            <>
              {totalAttempts === 0 ? (
                <div className="max-w-3xl mx-auto">
                  <EmptyScores onBack={handleBack} />
                </div>
              ) : (
                <div className="max-w-5xl mx-auto space-y-4">
                  <ScoresSummary totalAttempts={totalAttempts} yourAttempts={yourAttempts} examTitle={attemptsForExam[0]?.examId?.examTitle ?? "Exam"} />
                  <ScoresTable attempts={attemptsForExam} onView={handleViewAttempt} />
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExamAndScores;
