/* eslint-disable react/prop-types */

import { useState } from "react";
import { toast } from "react-toastify";

  function ReferRewards({
  rows = [],
  currency = "Tk",
  onWithdraw,          // async () => Promise<void>
  isWithdrawing = false,
}) {
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  const confirmed = rows.filter(r => r.status === "confirmed");
  const pending   = rows.filter(r => r.status === "pending");

  const totalEarned = confirmed.reduce((s, r) => s + (Number(r.reward) || 0), 0);
  const alreadyPaid = confirmed
    .filter(r => r.paidOut)
    .reduce((s, r) => s + (Number(r.reward) || 0), 0);

  const available   = Math.max(0, totalEarned - alreadyPaid);

  return (
    <section className="w-full">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Earned" value={`${totalEarned} ${currency}`} />
        <StatCard label="Pending" value={`${pending.reduce((s,r)=>s+(Number(r.reward)||0),0)} ${currency}`} />
        <StatCard label="Available to Withdraw" value={`${available} ${currency}`} accent />
      </div>

      {/* Withdraw */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Refer Rewards</h3>
        <button
          onClick={onWithdraw}
          disabled={available <= 0 || isWithdrawing}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold
            ${available <= 0 || isWithdrawing ? "bg-gray-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}
          `}
        >
          {isWithdrawing ? (
            <>
              <Spinner /> Processing…
            </>
          ) : (
            <>
              <WalletIcon /> Withdraw
            </>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="text-left">
              <Th>Date</Th>
              <Th>Course</Th>
              <Th>Referred User</Th>
              <Th>Status</Th>
              <Th className="text-right pr-4">Reward</Th>
              <Th className="text-center">Paid</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No referrals yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <Td>{fmtDate(r.date)}</Td>
                  <Td className="font-medium">{r.courseTitle}</Td>
                  <Td>{r.referredName || "-"}</Td>
                  <Td>
                    <StatusPill status={r.status} />
                  </Td>
                  <Td className="text-right pr-4 font-semibold">{Number(r.reward) || 0} {currency}</Td>
                  <Td className="text-center">
                    {r.paidOut ? <PaidIcon className="mx-auto" /> : <span className="text-gray-400">—</span>}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* --- small UI helpers --- */
function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 font-semibold uppercase tracking-wide text-xs ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
function StatCard({ label, value, accent = false }) {
  return (
    <div className={`rounded-xl border bg-white shadow-sm p-4 ${accent ? "border-emerald-200" : "border-gray-100"}`}>
      <div className="text-xs uppercase text-gray-500 font-semibold">{label}</div>
      <div className={`mt-1 text-xl font-extrabold ${accent ? "text-emerald-700" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}
function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const cfg = {
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  }[s] || "bg-gray-50 text-gray-600 border-gray-200";
  const label = { confirmed: "Confirmed", pending: "Pending", cancelled: "Cancelled" }[s] || "—";
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border font-semibold ${cfg}`}>{label}</span>;
}
function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
function WalletIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7h18v10H3z" />
      <path d="M16 12h3" />
      <path d="M3 7V5a2 2 0 012-2h11" />
    </svg>
  );
}
function PaidIcon({ className = "" }) {
  return (
    <svg className={`w-5 h-5 text-emerald-600 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}


export default function ReferRewardsPage() {
  const [withdrawing, setWithdrawing] = useState(false);

  // সাধারণ ডেমো ডাটা (API থেকে আসলে সেই ডাটা দিন)
  const rows = [
    { id: "1", date: "2025-10-22T12:29:27.611Z", courseTitle: "NSU Smash Batch 2025", referredName: "Rakib", status: "confirmed", reward: 0, paidOut: false },
    { id: "2", date: "2025-10-19T10:00:00.000Z", courseTitle: "BRAC Smash Batch",   referredName: "Mitu",  status: "pending",   reward: 10, paidOut: false },
    { id: "3", date: "2025-10-10T10:00:00.000Z", courseTitle: "EWU Course",         referredName: "Shuvo", status: "confirmed", reward: 0, paidOut: true  },
  ];

  const handleWithdraw = async () => {
    try {
      setWithdrawing(true);
      await new Promise(r => setTimeout(r, 1200));
      toast.success("Withdrawal request submitted!");
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error("Failed to withdraw.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ReferRewards
        rows={rows}
        currency="Tk"
        onWithdraw={handleWithdraw}
        isWithdrawing={withdrawing}
      />
    </div>
  );
}