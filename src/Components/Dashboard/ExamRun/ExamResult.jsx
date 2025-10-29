import { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Navbar from "../../Home/Navbar/Navbar";
import Footer from "../../../Layout/Footer";
import { useGetAllmcqAttempQuery } from "../../../../redux/Features/Api/Mcq/McqApi";
import { useGetAllExamQuery } from "../../../../redux/Features/Api/Exam/Exam";
import QuestionDetailRow from "./QuestionDetailRow";
import ProgressCardCompact from "./ProgressCardCompact";

const OptionLabel = ({ idx }) => String.fromCharCode(65 + idx);

const SafeHtml = ({ html }) => <div dangerouslySetInnerHTML={{ __html: String(html || "") }} />;

const TickIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CrossIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const normalize = (v) => (v === null || v === undefined ? "" : String(v).trim());
const letterToIndex = (letter) => {
  if (!letter || typeof letter !== "string") return null;
  const up = letter.trim().toUpperCase();
  if (/^[A-Z]$/.test(up)) return up.charCodeAt(0) - 65;
  return null;
};
const isNumericString = (s) => {
  if (s === null || s === undefined) return false;
  return /^-?\d+$/.test(String(s).trim());
};
const compareText = (a, b) => normalize(a).toLowerCase() === normalize(b).toLowerCase();

const isAnswerCorrect = (answerObj) => {
  if (!answerObj) return false;
  const q = answerObj.questionId ?? {};
  const options = Array.isArray(q.options) ? q.options : null;
  const rawCorrect = q.correctAnswer ?? "";
  const rawSelected = answerObj.selectedAnswer ?? "";
  const corr = normalize(rawCorrect);
  const sel = normalize(rawSelected);
  if (corr && sel && corr.toLowerCase() === sel.toLowerCase()) return true;
  if (options && options.length > 0) {
    if (isNumericString(sel)) {
      const selIdx = Number(sel) - 1;
      if (selIdx >= 0 && selIdx < options.length) {
        const selectedText = options[selIdx];
        if (selectedText !== undefined && compareText(selectedText, corr)) return true;
      }
    } else {
      const selLetterIdx = letterToIndex(sel);
      if (selLetterIdx !== null && selLetterIdx >= 0 && selLetterIdx < options.length) {
        const selectedText = options[selLetterIdx];
        if (selectedText !== undefined && compareText(selectedText, corr)) return true;
      }
      const byTextMatch = options.findIndex((op) => compareText(op, sel));
      if (byTextMatch >= 0) {
        if (isNumericString(corr)) {
          const corrIdx = Number(corr) - 1;
          if (corrIdx === byTextMatch) return true;
        } else {
          if (compareText(options[byTextMatch], corr)) return true;
        }
      }
      if (isNumericString(corr)) {
        const corrIdx = Number(corr) - 1;
        if (corrIdx >= 0 && corrIdx < options.length) {
          const corrText = options[corrIdx];
          if (compareText(corrText, sel)) return true;
        }
      }
      const corrLetterIdx = letterToIndex(corr);
      if (corrLetterIdx !== null && corrLetterIdx >= 0 && corrLetterIdx < options.length) {
        const corrText2 = options[corrLetterIdx];
        if (compareText(corrText2, sel)) return true;
      }
    }
  } else {
    if (corr && sel && compareText(corr, sel)) return true;
  }
  return false;
};

const QuestionDetailRowInternal = ({ qObj }) => {
  const [openExplanation, setOpenExplanation] = useState(false);
  const q = qObj?.questionId ?? {};
  const questionText = q.question ?? "(No question text)";
  const options = Array.isArray(q.options) ? q.options : null;
  const rawCorrect = q.correctAnswer ?? "";
  const selected = qObj?.selectedAnswer ?? "";
  let correctIndex = null;
  let correctText = null;
  if (options && options.length > 0) {
    if (!isNaN(Number(rawCorrect))) {
      const idx = Number(rawCorrect) - 1;
      if (idx >= 0 && idx < options.length) correctIndex = idx;
      correctText = options[correctIndex] ?? null;
    } else {
      const byTextIdx = options.findIndex((op) => String(op).trim() === String(rawCorrect).trim());
      if (byTextIdx >= 0) {
        correctIndex = byTextIdx;
        correctText = options[byTextIdx];
      } else {
        if (typeof rawCorrect === "string" && /^[A-Za-z]$/.test(rawCorrect.trim())) {
          const derived = rawCorrect.trim().toUpperCase().charCodeAt(0) - 65;
          if (derived >= 0 && derived < options.length) {
            correctIndex = derived;
            correctText = options[derived];
          }
        }
      }
    }
  } else {
    correctText = rawCorrect ?? null;
  }
  let isCorrect = false;
  if (options && options.length > 0) {
    if (selected === null || selected === undefined || selected === "") {
      isCorrect = false;
    } else if (!isNaN(Number(selected))) {
      isCorrect = Number(selected) - 1 === correctIndex;
    } else if (typeof selected === "string" && /^[A-Za-z]$/.test(selected.trim())) {
      const selIdx = selected.trim().toUpperCase().charCodeAt(0) - 65;
      isCorrect = selIdx === correctIndex;
    } else {
      isCorrect = String(selected).trim() === String(correctText).trim();
    }
  } else {
    if ((selected === null || selected === undefined || selected === "") && (correctText === null || correctText === "")) {
      isCorrect = false;
    } else {
      isCorrect = String(selected).trim() === String(correctText).trim();
    }
  }
  return (
    <div className="question-row">
      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">Question</div>
        <div className="text-base font-medium text-gray-800">
          <SafeHtml html={questionText} />
        </div>
      </div>
      {options && options.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {options.map((opt, idx) => {
            const isThisCorrect = correctIndex === idx;
            let userSelectedThis = false;
            if (!isNaN(Number(selected))) {
              userSelectedThis = Number(selected) - 1 === idx;
            } else if (typeof selected === "string" && /^[A-Za-z]$/.test(selected.trim())) {
              userSelectedThis = selected.trim().toUpperCase().charCodeAt(0) - 65 === idx;
            } else {
              userSelectedThis = String(selected).trim() === String(opt).trim();
            }
            return (
              <div
                key={idx}
                className={`p-3 rounded-md border flex items-start gap-3 ${isThisCorrect ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"} ${userSelectedThis && !isThisCorrect ? "border-red-300 bg-red-50" : ""}`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${isThisCorrect ? "bg-green-600 text-white" : userSelectedThis ? "bg-gray-200 text-gray-800" : "bg-white text-gray-700 border"}`}>
                    <span>{OptionLabel({ idx })}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-gray-800"><SafeHtml html={opt} /></div>
                    <div className="ml-3 flex items-center gap-2">
                      {isThisCorrect && (
                        <div className="text-green-700 flex items-center gap-1 text-sm font-semibold">
                          <TickIcon className="w-4 h-4" />
                          <span>Correct</span>
                        </div>
                      )}
                      {userSelectedThis && !isThisCorrect && (
                        <div className="text-red-600 flex items-center gap-1 text-sm font-semibold">
                          <CrossIcon className="w-4 h-4" />
                          <span>Your answer</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-1">Correct Answer</div>
          <div className="p-3 rounded-md border border-gray-200 bg-white">
            <div className="text-sm text-gray-800">{correctText ?? "—"}</div>
          </div>
          <div className="mt-2">
            <div className="text-sm text-gray-600 mb-1">Your Answer</div>
            <div className={`p-3 rounded-md border ${isCorrect ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <div className="text-sm text-gray-800">{String(selected ?? "—")}</div>
            </div>
          </div>
        </div>
      )}
      {(q.explanation || q.explain || q.hint) && (
        <div className="mt-3">
          <button type="button" onClick={() => setOpenExplanation((s) => !s)} className="text-sm text-[#0b74a6] hover:underline">
            {openExplanation ? "Hide explanation" : "View explanation"}
          </button>
          {openExplanation && (
            <div className="mt-2 p-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-700">
              <SafeHtml html={q.explanation ?? q.explain ?? q.hint} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProgressCircle = ({ percent = 0, size = 64, stroke = 6 }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(100, percent));
  const dash = (filled / 100) * c;
  const strokeColor = percent >= 50 ? "#10B981" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#f3f4f6" strokeWidth={stroke} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={strokeColor} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} fill="none" />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="text-xs font-semibold" style={{ fontSize: Math.floor(size * 0.26) }} fill={percent >= 50 ? "#065f46" : "#7f1d1d"} transform="rotate(90, 0, 0)">
        {Math.round(percent)}%
      </text>
    </svg>
  );
};

const normalizeStr = (s) => {
  if (!s && s !== 0) return "";
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\u0980-\u09FF\- ]+/g, "").trim().replace(/\s+/g, "-");
};

const normalize2 = (v) => (v === null || v === undefined ? "" : String(v).trim());
const letterToIndex2 = (letter) => {
  if (!letter || typeof letter !== "string") return null;
  const up = letter.trim().toUpperCase();
  if (/^[A-Z]$/.test(up)) return up.charCodeAt(0) - 65;
  return null;
};
const isNumericString2 = (s) => {
  if (s === null || s === undefined) return false;
  return /^-?\d+$/.test(String(s).trim());
};
const compareText2 = (a, b) => normalize2(a).toLowerCase() === normalize2(b).toLowerCase();

const isAnswerCorrect2 = (answerObj) => {
  if (!answerObj) return false;
  const q = answerObj.questionId ?? {};
  const options = Array.isArray(q.options) ? q.options : null;
  const rawCorrect = q.correctAnswer ?? "";
  const rawSelected = answerObj.selectedAnswer ?? "";
  const corr = normalize2(rawCorrect);
  const sel = normalize2(rawSelected);
  if (corr && sel && corr.toLowerCase() === sel.toLowerCase()) return true;
  if (options && options.length > 0) {
    if (isNumericString2(sel)) {
      const selIdx = Number(sel) - 1;
      if (selIdx >= 0 && selIdx < options.length) {
        const selectedText = options[selIdx];
        if (selectedText !== undefined && compareText2(selectedText, corr)) return true;
      }
    } else {
      const selLetterIdx = letterToIndex2(sel);
      if (selLetterIdx !== null && selLetterIdx >= 0 && selLetterIdx < options.length) {
        const selectedText = options[selLetterIdx];
        if (selectedText !== undefined && compareText2(selectedText, corr)) return true;
      }
      const byTextMatch = options.findIndex((op) => compareText2(op, sel));
      if (byTextMatch >= 0) {
        if (isNumericString2(corr)) {
          const corrIdx = Number(corr) - 1;
          if (corrIdx === byTextMatch) return true;
        } else {
          if (compareText2(options[byTextMatch], corr)) return true;
        }
      }
      if (isNumericString2(corr)) {
        const corrIdx = Number(corr) - 1;
        if (corrIdx >= 0 && corrIdx < options.length) {
          const corrText = options[corrIdx];
          if (compareText2(corrText, sel)) return true;
        }
      }
      const corrLetterIdx = letterToIndex2(corr);
      if (corrLetterIdx !== null && corrLetterIdx >= 0 && corrLetterIdx < options.length) {
        const corrText2 = options[corrLetterIdx];
        if (compareText2(corrText2, sel)) return true;
      }
    }
  } else {
    if (corr && sel && compareText2(corr, sel)) return true;
  }
  return false;
};

const ExamResult = () => {
  const { slug, attemptId: attemptIdParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth || {});
  const attemptIdFromState = location?.state?.attemptId ?? null;
  const requestedAttemptId = attemptIdFromState ?? attemptIdParam ?? null;
  const { data: attemptsData, isLoading: attemptsLoading, isError: attemptsError } = useGetAllmcqAttempQuery();
  const { data: examsData } = useGetAllExamQuery();
  const attempts = attemptsData?.data ?? [];
  const exams = examsData?.data ?? [];
  const normalizedSlugMemo = useMemo(() => normalizeStr(slug), [slug]);
  const resolvedExamId = useMemo(() => {
    if (!slug) return null;
    if (/^[0-9a-fA-F]{24}$/.test(String(slug).trim())) return String(slug).trim();
    const sNorm = normalizedSlugMemo;
    const found = (exams || []).find((ex) => {
      if (!ex) return false;
      if (ex._id && String(ex._id).trim().toLowerCase() === String(slug).trim().toLowerCase()) return true;
      if (ex.slug && normalizeStr(ex.slug) === sNorm) return true;
      if (ex.examTitle && normalizeStr(ex.examTitle) === sNorm) return true;
      return false;
    });
    return found?._id ?? null;
  }, [exams, slug, normalizedSlugMemo]);
  const attemptsForExam = useMemo(() => {
    if (!slug) return [];
    const sNorm = normalizedSlugMemo;
    return attempts.filter((a) => {
      const ex = a?.examId ?? {};
      if (!ex) return false;
      if (resolvedExamId && ex._id && String(ex._id).trim().toLowerCase() === String(resolvedExamId).trim().toLowerCase()) return true;
      if (ex._id && String(ex._id).trim().toLowerCase() === String(slug).trim().toLowerCase()) return true;
      if (ex.slug && normalizeStr(ex.slug) === sNorm) return true;
      if (ex.examTitle && normalizeStr(ex.examTitle) === sNorm) return true;
      return false;
    });
  }, [attempts, slug, resolvedExamId, normalizedSlugMemo]);
  const chosenAttempt = useMemo(() => {
    if (!attemptsForExam || attemptsForExam.length === 0) return null;
    if (requestedAttemptId) {
      const exact = attemptsForExam.find((a) => String(a._id) === String(requestedAttemptId));
      if (exact) return exact;
      const fallbackExact = attemptsForExam.find((a) => a?.examId?._id && String(a?.examId?._id) === String(requestedAttemptId));
      if (fallbackExact) return fallbackExact;
    }
    if (userInfo) {
      const uid = userInfo._id ?? userInfo.id;
      const userAttempts = attemptsForExam.filter((a) => String(a?.studentId?._id) === String(uid)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (userAttempts.length > 0) return userAttempts[0];
    }
    return [...attemptsForExam].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] ?? null;
  }, [attemptsForExam, requestedAttemptId, userInfo]);
  const debugInfo = useMemo(() => ({
    slugRaw: slug ?? null,
    normalizedSlug: normalizedSlugMemo,
    resolvedExamId,
    requestedAttemptId,
    attemptsTotal: attempts.length,
    attemptsForExamCount: attemptsForExam.length,
    firstAttemptsPreview: attemptsForExam.slice(0, 6).map(a => ({ _id: a._id, examId: a.examId?._id, examSlug: a.examId?.slug, examTitle: a.examId?.examTitle, studentId: a.studentId?._id, createdAt: a.createdAt })),
  }), [slug, normalizedSlugMemo, resolvedExamId, requestedAttemptId, attempts, attemptsForExam]);
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
  const exam = chosenAttempt.examId ?? {};
  const answers = Array.isArray(chosenAttempt.answer) ? chosenAttempt.answer : [];
  const totalQuestions = answers.length || Number(exam.totalQuestion ?? 0);
  let recomputedCorrect = 0;
  let recomputedWrong = 0;
  const subjectMap = {};
  answers.forEach((ans) => {
    const q = ans.questionId || {};
    const subjRaw = (q.subject || "").trim();
    const subjectName = subjRaw.length > 0 ? subjRaw : "General";
    if (!subjectMap[subjectName]) subjectMap[subjectName] = { correct: 0, total: 0, items: [] };
    subjectMap[subjectName].total += 1;
    const correct = isAnswerCorrect2(ans);
    if (correct) subjectMap[subjectName].correct += 1;
    if (correct) recomputedCorrect += 1;
    else recomputedWrong += 1;
    subjectMap[subjectName].items.push(ans);
  });
  const overallPercent = totalQuestions ? Math.round((recomputedCorrect / totalQuestions) * 100) : 0;
  const subjects = Object.keys(subjectMap).map((name) => {
    const { correct, total } = subjectMap[name];
    return { name, correct, total, percentage: total ? Math.round((correct / total) * 100) : 0, items: subjectMap[name].items };
  });
  if (subjects.length === 0) subjects.push({ name: "General", correct: recomputedCorrect, total: totalQuestions, percentage: overallPercent, items: answers });
  const toggleSubject = (name) => setOpenSubjects((prev) => ({ ...prev, [name]: !prev[name] }));
  const downloadCSV = () => {
    const rows = [["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Correct Answer", "Selected Answer", "IsCorrect"]];
    answers.forEach((ans) => {
      const q = ans.questionId || {};
      const opts = Array.isArray(q.options) ? q.options : [];
      const sel = ans.selectedAnswer ?? "";
      const corr = q.correctAnswer ?? "";
      const isCorr = isAnswerCorrect2(ans);
      rows.push([(q.question || "").replace(/(<([^>]+)>)/gi, ""), opts[0] ?? "", opts[1] ?? "", opts[2] ?? "", opts[3] ?? "", corr, sel, isCorr ? "Yes" : "No"]);
    });
    const csvContent = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(exam.examTitle || "exam").replace(/\s+/g, "-")}-questions.csv`;
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
            <p className="text-sm text-gray-500 mt-2">Exam: <span className="font-medium">{exam?.examTitle}</span><br />Sections Completed: <span className="font-medium">1/1</span></p>
          </div>
          <div className="bg-green-100 text-green-800 font-semibold py-3 rounded-md text-lg mb-8">Overall Score: {overallPercent}%</div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {subjects.map((s) => (
              <ProgressCardCompact
                key={s.name}
                subject={s.name}
                percent={s.percent}
                correct={s.correct}
                total={s.total}
                onView={() =>
                  setOpenSubjects((prev) => ({ ...prev, [s.name]: !prev[s.name] }))
                }
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <button onClick={downloadCSV} className="px-5 py-2  bg-gradient-to-r from-[#6A0000] via-[#B10000] to-[#FF0000]  text-white rounded-md">Download Question Details</button>
          </div>
          <div className="space-y-4 text-left">
            {showAllDetails && (
              <div>
                <h3 className="text-lg font-semibold mb-3">All Questions</h3>
                <div className="space-y-4">
                  {answers.map((ans, idx) => (
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
