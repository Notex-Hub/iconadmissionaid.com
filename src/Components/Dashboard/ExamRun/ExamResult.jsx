/* ExamResult.jsx (updated) */
import  { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Navbar from "../../Home/Navbar/Navbar";
import Footer from "../../../Layout/Footer";
import { useGetAllmcqAttempQuery } from "../../../../redux/Features/Api/Mcq/McqApi";
import { useGetAllExamQuery } from "../../../../redux/Features/Api/Exam/Exam";

/* Helpers */
const normalizeStr = (s) => {
  if (!s && s !== 0) return "";
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0980-\u09FF\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

/* QuestionDetailRow & SubjectCard — reuse your existing ones (omit here for brevity) */
/* ... (you can reuse your previous QuestionDetailRow and SubjectCard implementations) ... */

const ExamResult = () => {
  const { slug, attemptId: attemptIdParam } = useParams(); // route: /exam/:slug/result/:attemptId?
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth || {});

  const attemptIdFromState = location?.state?.attemptId ?? null;
  // final attemptId to prefer:
  const requestedAttemptId = attemptIdFromState ?? attemptIdParam ?? null;

  // fetch attempts & exams
  const { data: attemptsData, isLoading: attemptsLoading, isError: attemptsError } = useGetAllmcqAttempQuery();
  const { data: examsData } = useGetAllExamQuery();

  const attempts = attemptsData?.data ?? [];
  const exams = examsData?.data ?? [];

  const normalizedSlug = useMemo(() => normalizeStr(slug), [slug]);

  // resolve exam id (same as before)
  const resolvedExamId = useMemo(() => {
    if (!slug) return null;
    if (/^[0-9a-fA-F]{24}$/.test(String(slug).trim())) return String(slug).trim();
    const sNorm = normalizedSlug;
    const found = (exams || []).find((ex) => {
      if (!ex) return false;
      if (ex._id && String(ex._id).trim().toLowerCase() === String(slug).trim().toLowerCase()) return true;
      if (ex.slug && normalizeStr(ex.slug) === sNorm) return true;
      if (ex.examTitle && normalizeStr(ex.examTitle) === sNorm) return true;
      return false;
    });
    return found?._id ?? null;
  }, [exams, slug, normalizedSlug]);

  // filter attempts for this exam
  const attemptsForExam = useMemo(() => {
    if (!slug) return [];
    const sNorm = normalizedSlug;
    return attempts.filter((a) => {
      const ex = a?.examId ?? {};
      if (!ex) return false;
      if (resolvedExamId && ex._id && String(ex._id).trim().toLowerCase() === String(resolvedExamId).trim().toLowerCase()) return true;
      if (ex._id && String(ex._id).trim().toLowerCase() === String(slug).trim().toLowerCase()) return true;
      if (ex.slug && normalizeStr(ex.slug) === sNorm) return true;
      if (ex.examTitle && normalizeStr(ex.examTitle) === sNorm) return true;
      return false;
    });
  }, [attempts, slug, resolvedExamId, normalizedSlug]);

  // PICK chosenAttempt:
  // 1) if requestedAttemptId provided, try to find exact attempt by _id
  // 2) else prefer user's latest attempt, else latest attempt for this exam
  const chosenAttempt = useMemo(() => {
    if (!attemptsForExam || attemptsForExam.length === 0) return null;

    // 1) exact attemptId match (highest priority)
    if (requestedAttemptId) {
      const exact = attemptsForExam.find((a) => String(a._id) === String(requestedAttemptId));
      if (exact) return exact;
      // also try matching if requestedAttemptId came as exam._id (edge cases)
      const fallbackExact = attemptsForExam.find((a) => a?.examId?._id && String(a._examId?._id) === String(requestedAttemptId));
      if (fallbackExact) return fallbackExact;
    }

    // 2) user's latest attempt for this exam
    if (userInfo) {
      const uid = userInfo._id ?? userInfo.id;
      const userAttempts = attemptsForExam
        .filter((a) => String(a?.studentId?._id) === String(uid))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (userAttempts.length > 0) return userAttempts[0];
    }

    // 3) latest overall for this exam
    return [...attemptsForExam].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ?? null;
  }, [attemptsForExam, requestedAttemptId, userInfo]);

  // debug info (show if needed)
  const debugInfo = useMemo(() => ({
    slugRaw: slug ?? null,
    normalizedSlug,
    resolvedExamId,
    requestedAttemptId,
    attemptsTotal: attempts.length,
    attemptsForExamCount: attemptsForExam.length,
    firstAttemptsPreview: attemptsForExam.slice(0, 6).map(a => ({ _id: a._id, examId: a.examId?._id, examSlug: a.examId?.slug, examTitle: a.examId?.examTitle, studentId: a.studentId?._id, createdAt: a.createdAt })),
  }), [slug, normalizedSlug, resolvedExamId, requestedAttemptId, attempts, attemptsForExam]);

  // ui state
  const [openSubjects, setOpenSubjects] = useState({});
  const [showAllDetails, setShowAllDetails] = useState(false);

  if (attemptsLoading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading...</div>;
  if (attemptsError) return <div className="min-h-screen flex items-center justify-center text-red-500">Server error.</div>;

  if (!chosenAttempt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="absolute inset-x-0 top-0 z-50"><Navbar /></div>
        <main className="container mx-auto px-4 pt-28 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
              <div className="font-semibold mb-2">Debug panel (no chosen attempt)</div>
              <pre className="text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            <div className="flex flex-col items-center justify-center text-gray-600 py-20">
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-sm mb-4">You haven't completed this exam yet (or attempts for this exam are not found).</p>
              <button onClick={() => navigate("/")} className="px-5 py-2 bg-[#c21010] text-white rounded-md shadow hover:bg-[#a50e0e]">Go Home</button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // derive stats from chosenAttempt (same as before)
  const exam = chosenAttempt.examId ?? {};
  const correctCount = Number(chosenAttempt.correctCount ?? 0);
  const wrongCount = Number(chosenAttempt.wrongCount ?? 0);
  const totalQuestions = Number(exam.totalQuestion ?? (chosenAttempt.answer?.length ?? 0));
  const overallPercent = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // build subject breakdown
  const subjectMap = {};
  (chosenAttempt.answer || []).forEach((ans) => {
    const q = ans.questionId || {};
    const subjRaw = (q.subject || "").trim();
    const subjectName = subjRaw.length > 0 ? subjRaw : "General";
    if (!subjectMap[subjectName]) subjectMap[subjectName] = { correct: 0, total: 0, items: [] };
    subjectMap[subjectName].total += 1;

    const sel = String(ans.selectedAnswer ?? "").trim();
    const corr = String(q.correctAnswer ?? "").trim();
    let isCorrect = false;
    if (sel === corr) isCorrect = true;
    else if (Array.isArray(q.options)) {
      if (!isNaN(Number(corr))) {
        const correctIdx = Number(corr) - 1;
        const correctText = q.options[correctIdx];
        if (String(sel) === String(correctText)) isCorrect = true;
      } else {
        if (String(sel) === String(corr)) isCorrect = true;
      }
    }
    if (isCorrect) subjectMap[subjectName].correct += 1;
    subjectMap[subjectName].items.push(ans);
  });

  const subjects = Object.keys(subjectMap).map((name) => {
    const { correct, total } = subjectMap[name];
    return { name, correct, total, percentage: total ? Math.round((correct / total) * 100) : 0, items: subjectMap[name].items };
  });
  if (subjects.length === 0) subjects.push({ name: "General", correct: correctCount, total: totalQuestions, percentage: overallPercent, items: chosenAttempt.answer || [] });

  const toggleSubject = (name) => setOpenSubjects((prev) => ({ ...prev, [name]: !prev[name] }));

  const downloadCSV = () => {
    const rows = [["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Correct Answer", "Selected Answer", "IsCorrect"]];
    (chosenAttempt.answer || []).forEach((ans) => {
      const q = ans.questionId || {};
      const opts = Array.isArray(q.options) ? q.options : [];
      const sel = ans.selectedAnswer ?? "";
      const corr = q.correctAnswer ?? "";
      let isCorrect = false;
      if (String(sel) === String(corr)) isCorrect = true;
      else if (Array.isArray(opts)) {
        if (!isNaN(Number(corr))) {
          const corrText = opts[Number(corr) - 1];
          if (String(sel) === String(corrText)) isCorrect = true;
        } else {
          if (String(sel) === String(corr)) isCorrect = true;
        }
      }
      rows.push([(q.question || "").replace(/(<([^>]+)>)/gi, ""), opts[0] ?? "", opts[1] ?? "", opts[2] ?? "", opts[3] ?? "", corr, sel, isCorrect ? "Yes" : "No"]);
    });
    const csvContent = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exam.examTitle || "exam"}-questions.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute inset-x-0 top-0 z-50"><Navbar /></div>

      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-3">✓</div>
            <h2 className="text-2xl font-bold text-gray-800">Exam Completed!</h2>
            <p className="text-gray-600 mt-1">Thank you for taking the examination.</p>
            <p className="text-sm text-gray-500 mt-2">Exam: <span className="font-medium">{exam?.examTitle}</span><br/>Sections Completed: <span className="font-medium">1/1</span></p>
          </div>

          <div className="bg-green-100 text-green-800 font-semibold py-3 rounded-md text-lg mb-8">Overall Score: {overallPercent}%</div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {subjects.map((sub) => (
              <div key={sub.name}>
                <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{sub.name}</h4>
                    <div className={`text-sm font-semibold ${sub.percentage >= 50 ? "text-green-600" : "text-red-500"}`}>{sub.percentage}%</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">Correct Answers: <span className="font-medium">{sub.correct}</span></div>
                  <div className="text-sm text-gray-600 mb-3">Questions: <span className="font-medium">{sub.total}</span></div>
                  <button onClick={() => toggleSubject(sub.name)} className="text-sm text-[#007bff] font-medium hover:underline flex items-center gap-1">
                    <span>🔍</span> View Question Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <button onClick={() => setShowAllDetails((s) => !s)} className="px-5 py-2 bg-[#0b74a6] text-white rounded-md">{showAllDetails ? "Hide All Details" : "View All Question Details"}</button>
            <button onClick={downloadCSV} className="px-5 py-2 bg-[#c21010] text-white rounded-md">⬇ Download Question Details</button>
          </div>

          <div className="space-y-4 text-left">
            {showAllDetails && (
              <div>
                <h3 className="text-lg font-semibold mb-3">All Questions</h3>
                <div className="space-y-4">
                  {chosenAttempt.answer.map((ans, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow-sm p-4">
                      <QuestionDetailRow qObj={ans} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showAllDetails && subjects.map((sub) => (
              <div key={sub.name}>
                {openSubjects[sub.name] && (
                  <div>
                    <h4 className="text-md font-semibold mb-2">{sub.name} — Details</h4>
                    <div className="space-y-4">
                      {sub.items.map((ans, i) => <QuestionDetailRow key={i} qObj={ans} />)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExamResult;
