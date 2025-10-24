/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import Navbar from "../../Components/Home/Navbar/Navbar";
import OurUniversity from "../../Components/Home/Section/OurUniversity";
import Footer from "../../Layout/Footer";
import { useGetAllResultQuery } from "../../../redux/Features/Api/result/result";

const PRIMARY = "#5D0000";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-white font-bold" style={{ background: PRIMARY }}>
      {children}
    </span>
  );
}

function StatusPill({ status }) {
  const ok = status?.toUpperCase() === "ACCEPTED";
  return (
    <div
      className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${
        ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
        {ok ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12l2.5 2.5L16 9" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M9 9l6 6M15 9l-6 6" />
          </>
        )}
      </svg>
      {ok ? "ACCEPTED" : "SORRY"}
    </div>
  );
}

function ChoiceCard({ orderLabel, subject, status }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 relative">
      {/* thin top border like screenshot */}
      <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl" style={{ background: PRIMARY }} />
      <div className="text-sm text-gray-600 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: PRIMARY }} />
        <span>{orderLabel}</span>
      </div>
      <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{subject || "-"}</h3>
      <StatusPill status={status} />
    </div>
  );
}

export default function NsuResultsLanding() {
  const [input, setInput] = useState("");
  const [queryPass, setQueryPass] = useState(""); // trigger fetch only when search

  // RTK Query — only runs when queryPass truthy
  const { data, isFetching, isError, error } = useGetAllResultQuery(queryPass, {
    skip: !queryPass,
  });

  // pick the latest item from API (it returns an array)
  const latest = useMemo(() => {
    const list = data?.data || [];
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.reduce((a, b) => (new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b));
  }, [data]);

  const handleSearch = () => {
    const trimmed = String(input || "").trim();
    if (trimmed) setQueryPass(trimmed);
  };

  // map latest record to UI-friendly structure
  const cards = latest
    ? [
        { orderLabel: "1ST Choice", subject: latest.firstChoice, status: latest.firstResult },
        { orderLabel: "2nd Choice", subject: latest.secondChoice, status: latest.secondResult },
        { orderLabel: "3rd Choice", subject: latest.thirdChoice, status: latest.thirdResult },
        { orderLabel: "4th Choice", subject: latest.fourthChoice, status: latest.fourthResult },
      ]
    : [];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-20">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <img
              src="/university/nsu.png"
              alt="NSU Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: PRIMARY }}>
              NSU Fall 2025
            </h1>
            <p className="text-gray-600 text-center max-w-2xl">
              Admission Results Portal
              <br className="hidden sm:block" />
              See your result with your test pass number. Make sure your test pass number matches your admit card.
            </p>
          </div>

          {/* Search Card */}
          <div className="mt-6 sm:mt-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <input type="checkbox" className="mr-1 rounded border-gray-300" defaultChecked readOnly />
              Test Pass Number
            </label>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:flex sm:items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your test pass number (e.g., 23164)"
                className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 px-4 py-3 text-gray-900"
              />
              <button
                onClick={handleSearch}
                disabled={!input || isFetching}
                className="whitespace-nowrap inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold text-white w-full sm:w-auto disabled:opacity-60"
                style={{ background: PRIMARY }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                {isFetching ? "SEARCHING..." : "SEARCH RESULTS"}
              </button>
            </div>
          </div>

          {/* If we have a result, show result grid like screenshot; otherwise show banner + courses */}
          {latest ? (
            <section className="mt-10 sm:mt-12">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: PRIMARY }}>
                  See Your Admission Results
                </h2>
                <p className="mt-2 text-gray-700 text-lg">
                  Test Pass: <Badge>{latest.testPass}</Badge>
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((c, i) => (
                  <ChoiceCard
                    key={i}
                    orderLabel={c.orderLabel}
                    subject={c.subject}
                    status={c.status}
                  />
                ))}
              </div>
            </section>
          ) : (
            <>
              {/* Banner */}
              <div className="mt-8 sm:mt-10 max-w-4xl mx-auto">
                <img
                  src="/course/img.jpg"
                  alt="Promo Banner"
                  className="w-full object-cover"
                />
              </div>

              {/* Courses Section */}
              <OurUniversity />
            </>
          )}

          {/* Error state */}
          {isError && (
            <div className="max-w-3xl mx-auto mt-6 text-center text-red-600 font-semibold">
              {error?.data?.message || "Failed to fetch results. Please try again."}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
