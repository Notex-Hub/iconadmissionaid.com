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
  const q = answerObj.questionId || {};
  const options = Array.isArray(q.options) ? q.options : null;
  const rawCorrect = q.correctAnswer || "";
  const rawSelected = answerObj.selectedAnswer || "";
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

const ExamResult = () => {
  const loc = useLocation();
  const state = loc && loc.state ? loc.state : null;
  const serverResponse = state && state.serverResponse ? state.serverResponse : null;

  const { slug, attemptId: attemptIdParam } = useParams();
  const navigate = useNavigate();
  const authState = useSelector((s) => s.auth || {});
  const userInfo = authState.userInfo;

  const { data: attemptsData, isLoading: attemptsLoading, isError: attemptsError } = useGetAllmcqAttempQuery();
  const { data: examsData } = useGetAllExamQuery();

  const attempts = attemptsData && attemptsData.data ? attemptsData.data : [];
  const exams = examsData && examsData.data ? examsData.data : [];

  const timeExpiredTransient = useMemo(() => {
    const d = serverResponse && serverResponse.data ? serverResponse.data : null;
    const msg = d && d.message ? d.message : serverResponse && serverResponse.message ? serverResponse.message : "";
    const expired = d && d.attempt == null && /valid time expired/i.test(String(msg));
    if (!expired) return null;
    let examMatch = null;
    if (d && d.examId) {
      examMatch = exams.find((e) => String(e._id) === String(d.examId)) || null;
    }
    const examObj = examMatch
      ? { _id: examMatch._id, examTitle: examMatch.examTitle, slug: examMatch.slug }
      : { _id: d ? d.examId : null, examTitle: "Exam", slug: slug };
    const totals = {
      score: Number(d && d.score != null ? d.score : 0),
      correct: Number(d && d.correctCount != null ? d.correctCount : 0),
      wrong: Number(d && d.wrongCount != null ? d.wrongCount : 0),
      total: Number(d && d.total != null ? d.total : 0),
    };
    const answersFromState = state && Array.isArray(state.answers) ? state.answers : [];
    return { exam: examObj, totals, answers: answersFromState, metaMessage: msg, notSaved: true };
  }, [serverResponse, exams, slug, state]);

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
    return found && found._id ? found._id : null;
  }, [exams, slug, normalizedSlugMemo]);

  const attemptsForExam = useMemo(() => {
    if (!slug) return [];
    const sNorm = normalizedSlugMemo;
    return attempts.filter((a) => {
      const ex = a && a.examId ? a.examId : {};
      if (!ex) return false;
      if (resolvedExamId && ex._id && String(ex._id).trim().toLowerCase() === String(resolvedExamId).trim().toLowerCase()) return true;
      if (ex._id && String(ex._id).trim().toLowerCase() === String(slug).trim().toLowerCase()) return true;
      if (ex.slug && normalizeStr(ex.slug) === sNorm) return true;
      if (ex.examTitle && normalizeStr(ex.examTitle) === sNorm) return true;
      return false;
    });
  }, [attempts, slug, resolvedExamId, normalizedSlugMemo]);

  const attemptIdFromState = state && state.attemptId ? state.attemptId : null;
  const requestedAttemptId = attemptIdFromState || attemptIdParam || null;

  const chosenAttempt = useMemo(() => {
    if (!attemptsForExam || attemptsForExam.length === 0) return null;
    if (requestedAttemptId) {
      const exact = attemptsForExam.find((a) => String(a._id) === String(requestedAttemptId));
      if (exact) return exact;
      const fallbackExact = attemptsForExam.find((a) => a && a.examId && a.examId._id && String(a.examId._id) === String(requestedAttemptId));
      if (fallbackExact) return fallbackExact;
    }
    if (userInfo) {
      const uid = userInfo._id || userInfo.id;
      const userAttempts = attemptsForExam
        .filter((a) => a && a.studentId && a.studentId._id && String(a.studentId._id) === String(uid))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (userAttempts.length > 0) return userAttempts[0];
    }
    const sorted = attemptsForExam.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted[0] || null;
  }, [attemptsForExam, requestedAttemptId, userInfo]);

  const transientFromState = state && state.transientResult ? state.transientResult : null;
  const transientResult = timeExpiredTransient || transientFromState || null;
  const usingTransient = !chosenAttempt && !!transientResult;

  const [openSubjects, setOpenSubjects] = useState({});
  const [showAllDetails, setShowAllDetails] = useState(false);

  if (attemptsLoading && !usingTransient) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }
  if (attemptsError && !usingTransient) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Server error.
      </div>
    );
  }
  if (!chosenAttempt && !usingTransient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="absolute inset-x-0 top-0 z-50">
          <Navbar />
        </div>
        <main className="container mx-auto px-4 pt-28 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col items-center justify-center text-gray-600 py-20">
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-sm mb-4">You havent completed this exam yet (or attempts for this exam are not found).</p>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2 bg-[#c21010] text-white rounded-md shadow hover:bg-[#a50e0e]"
              >
                Go Home
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const examFromAttempt = chosenAttempt && chosenAttempt.examId ? chosenAttempt.examId : {};
  const answersFromAttempt = chosenAttempt && Array.isArray(chosenAttempt.answer) ? chosenAttempt.answer : [];
  const examFromTransient = transientResult && transientResult.exam ? transientResult.exam : {};
  const answersFromTransient = transientResult && Array.isArray(transientResult.answers) ? transientResult.answers : [];

  const exam = usingTransient ? examFromTransient : examFromAttempt;
  const answers = usingTransient ? answersFromTransient : answersFromAttempt;

  let recomputedCorrect = 0;
  let recomputedWrong = 0;
  const subjectMap = {};
  (answers || []).forEach((ans) => {
    const q = ans && ans.questionId ? ans.questionId : {};
    const subjRaw = q && q.subject ? String(q.subject).trim() : "";
    const subjectName = subjRaw.length > 0 ? subjRaw : "General";
    if (!subjectMap[subjectName]) subjectMap[subjectName] = { correct: 0, total: 0, items: [] };
    subjectMap[subjectName].total += 1;
    const correct = isAnswerCorrect(ans);
    if (correct) subjectMap[subjectName].correct += 1;
    if (correct) recomputedCorrect += 1;
    else recomputedWrong += 1;
    subjectMap[subjectName].items.push(ans);
  });

  const totals = usingTransient && transientResult ? transientResult.totals || {} : {};
  const totalQuestions = (answers && answers.length) || Number(exam.totalQuestion || 0) || Number(totals.total || 0);
  const pctFromAnswers = totalQuestions ? Math.round((recomputedCorrect / totalQuestions) * 100) : 0;
  const pctFromTotals = usingTransient && totals && totals.total ? Math.round(((Number(totals.correct) || 0) / Number(totals.total)) * 100) : null;
  const overallPercent = pctFromTotals !== null ? pctFromTotals : pctFromAnswers;
  const serverScore = usingTransient ? Number((totals && totals.score) || 0) : null;

  const subjects = Object.keys(subjectMap).map((name) => {
    const agg = subjectMap[name];
    const correct = agg.correct;
    const total = agg.total;
    return { name, correct, total, percent: total ? Math.round((correct / total) * 100) : 0, items: agg.items };
  });
  if (subjects.length === 0) {
    subjects.push({
      name: "General",
      correct: pctFromTotals !== null ? Number((totals && totals.correct) || 0) : recomputedCorrect,
      total: Number((totals && totals.total) || totalQuestions || 0),
      percent: overallPercent,
      items: answers || [],
    });
  }

  const toggleSubject = (name) => {
    const copy = Object.assign({}, openSubjects);
    copy[name] = !copy[name];
    setOpenSubjects(copy);
  };

  const renderAllQuestions = (arr) => {
    return arr.map((ans, idx) => {
      const keyId =
        ans && ans.questionId && ans.questionId._id
          ? String(ans.questionId._id)
          : "q-" + String(idx);
      return (
        <div key={keyId} className="bg-white rounded-lg shadow-sm p-4">
          <QuestionDetailRow qObj={ans} />
        </div>
      );
    });
  };

  const renderSubjectDetails = (sub) => {
    const items = sub && sub.items ? sub.items : [];
    return items.map((ans, i) => {
      const keyId =
        ans && ans.questionId && ans.questionId._id
          ? String(ans.questionId._id)
          : sub.name + "-" + String(i);
      return <QuestionDetailRow key={keyId} qObj={ans} />;
    });
  };

  const downloadCSV = () => {
    const rows = [
      ["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Correct Answer", "Selected Answer", "IsCorrect"],
    ];
    (answers || []).forEach((ans) => {
      const q = (ans && ans.questionId) || {};
      const opts = Array.isArray(q.options) ? q.options : [];
      const sel = ans && ans.selectedAnswer ? ans.selectedAnswer : "";
      const corr = q && q.correctAnswer ? q.correctAnswer : "";
      const isCorr = isAnswerCorrect(ans);
      rows.push([
        String(q && q.question ? q.question : "").replace(/(<([^>]+)>)/gi, ""),
        opts[0] || "",
        opts[1] || "",
        opts[2] || "",
        opts[3] || "",
        corr,
        sel,
        isCorr ? "Yes" : "No",
      ]);
    });
    const csvContent = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const base = String(exam && exam.examTitle ? exam.examTitle : "exam").replace(/\s+/g, "-");
    a.download = usingTransient ? base + "-questions-transient.csv" : base + "-questions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
          {usingTransient ? (
            <div className="mb-4 p-3 rounded-md border border-yellow-300 bg-yellow-50 text-sm text-yellow-800">
              {(transientResult && transientResult.metaMessage) || "Time expired — result calculated but"} <strong>not saved</strong>.
            </div>
          ) : null}

          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-3">✓</div>
            <h2 className="text-2xl font-bold text-gray-800">Exam Completed!</h2>
            <p className="text-gray-600 mt-1">Thank you for taking the examination.</p>
            <p className="text-sm text-gray-500 mt-2">
              Exam: <span className="font-medium">{exam && exam.examTitle ? exam.examTitle : ""}</span>
              <br />
              Sections Completed: <span className="font-medium">1/1</span>
            </p>
          </div>

          <div className="bg-green-100 text-green-800 font-semibold py-3 rounded-md text-lg mb-8">
            Overall Score: {overallPercent}%
            {usingTransient ? (
              <span className="ml-2 text-sm font-normal text-green-700">
                {typeof serverScore === "number" ? "(Raw Score: " + String(serverScore) + ")" : null}
              </span>
            ) : null}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {subjects.map((s) => (
              <ProgressCardCompact
                key={s.name}
                subject={s.name}
                percent={s.percent}
                correct={s.correct}
                total={s.total}
                onView={function () {
                  toggleSubject(s.name);
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <button onClick={downloadCSV} className="px-5 py-2 bg-gradient-to-r from-[#6A0000] via-[#B10000] to-[#FF0000] text-white rounded-md">
              Download Question Details
            </button>
            <button onClick={function () { setShowAllDetails(!showAllDetails); }} className="px-4 py-2 border rounded-md hover:bg-gray-50">
              {showAllDetails ? "Hide All" : "Show All"}
            </button>
          </div>

          {usingTransient && (!answers || answers.length === 0) ? (
            <div className="mb-6 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3 text-left">
              Detailed breakdown isn’t available because time expired and items weren’t saved. If you pass answers in navigate , details will appear here.
            </div>
          ) : null}

          <div className="space-y-4 text-left">
            {showAllDetails ? (
              <div>
                <h3 className="text-lg font-semibold mb-3">All Questions</h3>
                <div className="space-y-4">{renderAllQuestions(answers || [])}</div>
              </div>
            ) : null}

            {!showAllDetails
              ? subjects.map((sub) => (
                  <div key={sub.name}>
                    {openSubjects[sub.name] ? (
                      <div>
                        <h4 className="text-md font-semibold mb-2">{sub.name} — Details</h4>
                        <div className="space-y-4">{renderSubjectDetails(sub)}</div>
                      </div>
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamResult;
