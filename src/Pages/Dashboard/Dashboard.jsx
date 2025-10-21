/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

// UI components
import LiveClass from "../../Components/Dashboard/Dashboard/LiveClass";
import { KPIBarCard } from "../../Components/Dashboard/Dashboard/KPIBarCard";
import { LinearBar } from "../../Components/Dashboard/Dashboard/LineBar";

// API hooks (adjust paths to your structure)
import { useGetAllCqQuery } from "../../../redux/Features/Api/Cq/CqApi";
import { useGetAllmcqAttempQuery } from "../../../redux/Features/Api/Mcq/McqApi";
import { useGetAllPurchaseQuery } from "../../../redux/Features/Api/Purchase/Purchase";
import { useGetAllOrderQuery } from "../../../redux/Features/Api/order/orderApi";
import { useGetAllLiveClassQuery } from "../../../redux/Features/Api/live/Live";

// -------------------- utils --------------------
const fmtPercent = (n) => (Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0);

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

// Attendance (30-day rolling) stored in localStorage
function useRollingAttendance() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const KEY = "dashboard_attendance_v1";
    const today = new Date();
    const stored = JSON.parse(localStorage.getItem(KEY) || "null");

    let start = stored?.start ? new Date(stored.start) : today;
    let days = stored?.days ?? 0;
    let lastDay = stored?.lastDay ? new Date(stored.lastDay) : null;

    // reset if > 30 days window
    const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    if (diffDays >= 30) {
      start = today;
      days = 0;
      lastDay = null;
    }

    // increment once per calendar day
    if (!lastDay || !isSameDay(today, lastDay)) {
      days = Math.min(30, days + 1);
      lastDay = today;
    }

    localStorage.setItem(KEY, JSON.stringify({ start, days, lastDay }));
    setPercent(fmtPercent((days / 30) * 100));
  }, []);

  return percent; // 0..100
}

// MCQ stats from attempts
function useMcqStats(attempts) {
  return useMemo(() => {
    if (!Array.isArray(attempts)) return { accuracy: 0, correct: 0, wrong: 0, total: 0, bySubject: [] };

    let correct = 0;
    let wrong = 0;
    const subjectTotals = new Map(); // subject => {correct, total}

    attempts.forEach((att) => {
      const ans = att?.answer || [];
      // prefer server-provided counts if they look valid
      if (Number.isFinite(att?.correctCount) || Number.isFinite(att?.wrongCount)) {
        correct += Number(att.correctCount || 0);
        wrong += Number(att.wrongCount || 0);
      }

      // also compute per subject + fallback correctness if counts were zeros
      ans.forEach((a) => {
        const q = a?.questionId || {};
        const subject = q?.subject?.trim() || "General";
        const selectedIndex = parseInt(a?.selectedAnswer, 10) - 1;
        const selected = Array.isArray(q?.options) ? q.options[selectedIndex] : undefined;
        const isCorrect = selected && q?.correctAnswer && String(selected).trim() === String(q.correctAnswer).trim();

        const prev = subjectTotals.get(subject) || { correct: 0, total: 0 };
        subjectTotals.set(subject, { correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 });

        // if server counts are 0 but we can compute, add here too
        if (!(Number.isFinite(att?.correctCount) || Number.isFinite(att?.wrongCount))) {
          if (isCorrect) correct += 1; else wrong += 1;
        }
      });
    });

    const total = correct + wrong;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    const bySubject = Array.from(subjectTotals, ([name, v]) => ({
      name,
      value: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    }))
      .sort((a, b) => b.value - a.value);

    return { accuracy, correct, wrong, total, bySubject };
  }, [attempts]);
}

// CQ activity (count last 30 days)
function useCqActivity(cqAttempts) {
  return useMemo(() => {
    if (!Array.isArray(cqAttempts)) return { count30d: 0, percent: 0 };
    const now = new Date();
    const since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const count30d = cqAttempts.filter((a) => new Date(a?.submittedTime || a?.createdAt || 0) >= since).length;
    // normalize: 10 submissions == 100%
    const percent = fmtPercent(Math.min(100, (count30d / 10) * 100));
    return { count30d, percent };
  }, [cqAttempts]);
}

export default function Dashboard() {
  // auth
  const { userInfo } = useSelector((state) => state.auth || {});

  // queries
  const { data: attemptsDataResp, isLoading: mcqLoading, isError: mcqError } = useGetAllmcqAttempQuery();
  const { data: cqResp, isLoading: cqLoading, isError: cqError } = useGetAllCqQuery();
  const { data: purchaseDataResp, isLoading: purchaseLoading } = useGetAllPurchaseQuery({ studentId: userInfo?._id });
  const { data: ordersResp, isLoading: ordersLoading, isError: ordersError } = useGetAllOrderQuery();
  const { data: liveResp, isLoading: liveLoading, isError: liveError } = useGetAllLiveClassQuery();

  // shape data
  const attempts = attemptsDataResp?.data || [];
  const cqAttempts = cqResp?.data || [];
  const purchases = purchaseDataResp?.data || [];
  const orders = ordersResp?.data || [];
  const liveClasses = liveResp?.data || [];

  // KPIs
  const mcqStats = useMcqStats(attempts);
  const cqActivity = useCqActivity(cqAttempts);
  const attendancePercent = useRollingAttendance();

  // Subjects progress for LinearBar
  const subjects = useMemo(() => {
    const list = mcqStats.bySubject.length > 0 ? mcqStats.bySubject : [{ name: "General", value: fmtPercent(mcqStats.accuracy) }];
    // keep at most 6 subjects for clean UI
    return list.slice(0, 6);
  }, [mcqStats]);

  // Live sessions (latest 3 always)
  const liveSessions = useMemo(() => {
    const today = new Date();

    const toSession = (lc) => {
      const start = new Date(lc?.createdAt || Date.now()); // REPLACE with lc.startTime if available
      const dateStr = start.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
      const timeStr = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

      let status;
      if (isSameDay(start, today)) status = "Live"; // today => Join Now
      else if (start < today) status = "Past"; // already happened
      else status = "Upcoming"; // future

      return {
        id: lc._id,
        title: lc.title || lc.courseId?.course_title || "Live Class",
        instructor: lc.createdBy?.name || "",
        type: "Lecture",
        date: dateStr,
        time: timeStr,
        duration: 60,
        status,
        link: lc.link,
        _start: start.getTime(),
      };
    };

    return (liveClasses || [])
      .map(toSession)
      .sort((a, b) => b._start - a._start)
      .slice(0, 3);
  }, [liveClasses]);

  const loading = mcqLoading || cqLoading || purchaseLoading || ordersLoading || liveLoading;
  const error = mcqError || cqError || ordersError || liveError ? "Failed to load some data." : null;

  function handleJoin(session) {
    if (session.status === "Live" && session.link) {
      window.open(session.link, "_blank");
      return;
    }
    if (session.status === "Past") {
      window.alert("This class is already over.");
      return;
    }
    window.alert("This class is not live yet.");
  }

  // Dynamic summary
  const summary = useMemo(() => {
    const parts = [];
    parts.push(`MCQ accuracy ${fmtPercent(mcqStats.accuracy)}% (${mcqStats.correct}/${mcqStats.total}).`);
    parts.push(`CQ submissions (30d): ${cqActivity.count30d}.`);
    parts.push(`Attendance last 30d: ${fmtPercent(attendancePercent)}%.`);
    if (purchases.length > 0) parts.push(`Active course: ${purchases[0]?.courseId?.course_title || "—"}.`);
    return parts.join(" ");
  }, [mcqStats, cqActivity, attendancePercent, purchases]);

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-600">Student Dashboard</h2>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <KPIBarCard
            title="MCQ Accuracy"
            value={loading ? null : fmtPercent(mcqStats.accuracy)}
            trend={0}
            subtitle={`${mcqStats.correct}/${mcqStats.total} correct`}
            colorClass="from-emerald-400 to-teal-400"
          />
          <KPIBarCard
            title="CQ Activity (30d)"
            value={loading ? null : cqActivity.percent}
            trend={0}
            subtitle={`${cqActivity.count30d} submissions`}
            colorClass="from-indigo-400 to-indigo-600"
          />
          <KPIBarCard
            title="Attendance"
            value={loading ? null : fmtPercent(attendancePercent)}
            trend={0}
            subtitle="Rolling 30 days"
            colorClass="from-yellow-400 to-orange-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Progress overview by subject */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Progress Overview</h3>
                <p className="text-sm text-gray-500">Subject-wise mastery</p>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : subjects.length === 0 ? (
                  <p className="text-sm text-gray-500">No subject data yet.</p>
                ) : (
                  subjects.map((s) => (
                    <div key={s.name} className="flex items-center gap-4">
                      <div className="w-40">
                        <p className="text-sm font-medium text-gray-700">{s.name}</p>
                      </div>
                      <div className="flex-1">
                        <LinearBar label="" value={s.value} colorFrom="from-indigo-500" colorTo="to-cyan-400" showPercent />
                      </div>
                      <div className="w-14 text-right">
                        <p className="text-sm font-medium text-gray-800">{s.value}%</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <p className="text-sm text-gray-500">Last 7 days</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <ul className="divide-y">
                  {/* Purchases */}
                  {(purchases || []).slice(0, 2).map((p) => (
                    <li key={p._id} className="py-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">Purchased course</p>
                        <p className="text-xs text-gray-500">{p?.courseId?.course_title} — {new Date(p?.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-xs text-green-600">Paid</div>
                    </li>
                  ))}

                  {/* Orders */}
                  {(orders || []).slice(0, 2).map((o) => (
                    <li key={o._id} className="py-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">Order placed</p>
                        <p className="text-xs text-gray-500">{o?.productId?.[0]?.title || "Product"} — {new Date(o?.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-xs text-gray-500">{o?.status}</div>
                    </li>
                  ))}

                  {/* MCQ Attempt */}
                  {(attempts || []).slice(0, 1).map((a) => (
                    <li key={a._id} className="py-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">MCQ Attempt</p>
                        <p className="text-xs text-gray-500">{a?.examId?.examTitle} — {a.correctCount}/{(a.correctCount || 0) + (a.wrongCount || 0)} correct</p>
                      </div>
                      <div className="text-xs text-gray-400">{new Date(a?.createdAt).toLocaleDateString()}</div>
                    </li>
                  ))}

                  {/* CQ Submission */}
                  {(cqAttempts || []).slice(0, 1).map((c) => (
                    <li key={c._id} className="py-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">CQ Submitted</p>
                        <p className="text-xs text-gray-500">{c?.examId?.examTitle} — PDF attached</p>
                      </div>
                      <div className="text-xs text-gray-400">{new Date(c?.submittedTime || c?.createdAt).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <LiveClass sessions={liveSessions} onJoin={handleJoin} />

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-2">Action Plan</p>
              <ol className="list-decimal pl-5 text-sm text-gray-600">
                <li>Review last 2 MCQ attempts and note errors.</li>
                <li>Submit at least 2 CQ answers this week.</li>
                <li>Join next live class and take notes.</li>
              </ol>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
