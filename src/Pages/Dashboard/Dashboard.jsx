/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import LiveClass from "../../Components/Dashboard/Dashboard/LiveClass";
import { KPIBarCard } from "../../Components/Dashboard/Dashboard/KPIBarCard";
import { LinearBar } from "../../Components/Dashboard/Dashboard/LineBar";


export default function Dashboard() {
  const [data, setData] = useState({ mcq: null, cq: null, gap: null, attendance: null, summary: "No data available yet." });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);

  const fetchMockData = () =>
    new Promise((res) =>
      setTimeout(
        () =>
          res({
            mcq: 72.5,
            cq: 68.2,
            gap: 85.3,
            attendance: 91,
            summary: "Focus on MCQs and CQs. Excellent performance in Gap section. Work on improving attendance.",
            live: [
              { id: 1, title: "Algebra: Key Tricks", instructor: "Mr. Rahim", type: "Lecture", date: "Oct 20, 2025", time: "6:00 PM", duration: 60, status: "Upcoming" },
              { id: 2, title: "Physics: Mock Discussion", instructor: "Ms. Sultana", type: "Discussion", date: "Oct 17, 2025", time: "Right Now", duration: 45, status: "Live" },
              { id: 3, title: "English: Essay Techniques", instructor: "Mr. Karim", type: "Lecture", date: "Oct 22, 2025", time: "4:00 PM", duration: 50, status: "Upcoming" }
            ],
            subjects: [
              { name: "Algebra", value: 82 },
              { name: "Physics", value: 68 },
              { name: "English", value: 74 },
              { name: "Chemistry", value: 59 },
              { name: "General Knowledge", value: 90 }
            ]
          }),
        700
      )
    );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchMockData()
      .then((res) => {
        if (!mounted) return;
        setData(res);
        setLiveSessions(res.live || []);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Failed to load");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function handleJoin(session) {
    if (session.status === "Live") {
      window.alert(`Joining live class: ${session.title}`);
    } else {
      window.alert(`Class not live yet. Scheduled: ${session.date} · ${session.time}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-600">Student Dashboard</h2>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <KPIBarCard title="MCQ Accuracy" value={loading ? null : data.mcq} trend={2.4} subtitle="Accuracy (last 10 tests)" colorClass="from-emerald-400 to-teal-400" />
          <KPIBarCard title="CQ Avg Score" value={loading ? null : data.cq} trend={-1.2} subtitle="Constructive answers" colorClass="from-indigo-400 to-indigo-600" />
          <KPIBarCard title="Attendance" value={loading ? null : data.attendance} trend={4} subtitle="Last 30 days" colorClass="from-yellow-400 to-orange-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Progress overview by subject */}
            <div className="bg-white rounded-2xl p-5  shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Progress Overview</h3>
                <p className="text-sm text-gray-500">Subject-wise mastery</p>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : (
                  data.subjects.map((s) => (
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
              <div className="bg-white rounded-2xl p-4 shadow-sm ">
                <ul className="divide-y">
                  <li className="py-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">Completed: Algebra mock</p>
                      <p className="text-xs text-gray-500">Score: 78% — reviewed mistakes</p>
                    </div>
                    <div className="text-xs text-gray-400">2 days ago</div>
                  </li>
                  <li className="py-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">Attempted: Physics quiz</p>
                      <p className="text-xs text-gray-500">Score: 64% — needs revision</p>
                    </div>
                    <div className="text-xs text-gray-400">4 days ago</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <LiveClass sessions={liveSessions} onJoin={handleJoin} />

            <div className="bg-white rounded-2xl p-4 shadow-sm ">
              <p className="text-sm font-medium text-gray-700 mb-2">Action Plan</p>
              <ol className="list-decimal pl-5 text-sm text-gray-600">
                <li>Practice timed MCQ sections: 3 per week.</li>
                <li>Write 2 CQ answers and review with tutor.</li>
                <li>Attend weekly live class and review recording.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* final summary */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm ">
          <p className="text-lg font-semibold text-gray-800 mb-2">Overall Summary</p>
          {loading ? <p className="text-sm text-gray-600">Loading full analysis...</p> : error ? <p className="text-sm text-red-600">{error}</p> : (
            <>
              <p className="text-sm text-gray-600 mb-3">{data.summary}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


