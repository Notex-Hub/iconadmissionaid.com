'use client';

import React, { useEffect, useMemo, useState } from 'react';

type FreeTest = {
  _id: string;
  name: string;
  number: string;
  intersted?: string;
  status?: string;
  crmStatus?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sandbox.iconadmissionaid.com/api/v1';
const API_BASE = `${API_BASE_URL}/free-test`;

export default function FreeTestsTable() {
  const [items, setItems] = useState<FreeTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json = await res.json();
        if (mounted) setItems(json.data ?? []);
      } catch (err: any) {
        setError(err.message || 'Fetch error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!fromDate && !toDate) return items;
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (to) to.setHours(23, 59, 59, 999);
    return items.filter((it) => {
      if (!it.createdAt) return false;
      const d = new Date(it.createdAt);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [items, fromDate, toDate]);

  const crmStatusOptions = ['Pending', 'Working', 'Contacted', 'Started', 'Done'];
  const statusOptions = ['Done', 'Processing'];

  // 🎨 Color mapping
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Processing':
      case 'Payment failed':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCrmColor = (crmStatus?: string) => {
    switch (crmStatus) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Contacted':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Working':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Started':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // helper to format updatedAt as: 9 Nov 08:09pm
  const formatUpdatedAt = (iso?: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' }); // e.g. "Nov"
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    return `${day} ${month} ${hh}:${mm}${ampm}`;
  };

  async function updateTest(id: string, payload: Partial<Pick<FreeTest, 'crmStatus' | 'status'>>) {
    const previous = items;
    const optimisticUpdatedAt = new Date().toISOString();
    setItems((s) => s.map((it) => (it._id === id ? { ...it, ...payload, updatedAt: optimisticUpdatedAt } : it)));

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const json = await res.json();
      if (json?.data) setItems((s) => s.map((it) => (it._id === id ? { ...it, ...json.data } : it)));
    } catch (err: any) {
      setItems(previous);
      alert('Update failed: ' + (err.message || 'unknown'));
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f1f8] p-6 text-sm text-[#2b2540]">
      <div className=" mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded shadow-sm border border-transparent">
            <svg className="w-4 h-4 text-[#5b4ea6]" viewBox="0 0 24 24" fill="none">
              <path d="M3 5h18M6 12h12M10 19h4" stroke="#7c6fbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[#6b5fa3]">Filter</span>
          </div>

          <div className="flex items-center gap-2 bg-white rounded shadow-sm px-3 py-2">
            <label className="text-xs text-[#6c6580] mr-2">From</label>
            <input
              type="date"
              value={fromDate ?? ''}
              onChange={(e) => setFromDate(e.target.value || null)}
              className="px-2 py-1 border rounded text-sm"
            />
            <label className="text-xs text-[#6c6580] ml-3 mr-2">To</label>
            <input
              type="date"
              value={toDate ?? ''}
              onChange={(e) => setToDate(e.target.value || null)}
              className="px-2 py-1 border rounded text-sm"
            />

            <button
              onClick={() => {
                setFromDate(null);
                setToDate(null);
              }}
              className="ml-4 px-3 py-1 bg-[#efeaff] rounded text-[#6b5fa3] text-sm"
            >
              Clear
            </button>
          </div>

          <div className="ml-auto text-xs text-[#7f7994]">
            {loading ? 'Loading…' : `${filtered.length} / ${items.length} rows`}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded p-4 shadow-lg border border-[#efeaf8]">
          {/* note: added an extra column for TIME (120px) */}
          <div className="grid grid-cols-[48px_1fr_220px_1fr_160px_160px_120px] gap-4 items-center text-xs text-[#6c6580] font-medium px-2 py-3 border-b border-[#efeaf8]">
            <div></div>
            <div>NAME</div>
            <div>NUMBER</div>
            <div>INTERESTED</div>
            <div>STATUS</div>
            <div>CRM STATUS</div>
            <div className="text-right">TIME</div>
          </div>

          <div className="divide-y divide-[#f0eef6]">
            {filtered.map((r) => (
              <div key={r._id} className="grid grid-cols-[48px_1fr_220px_1fr_160px_160px_120px] gap-4 items-center px-2 py-4">
                <div className="flex items-center justify-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#efe6ff] to-[#f7f3ff] flex items-center justify-center text-[#6b5fa3] font-semibold">
                    {r.name?.[0] ?? 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-[#2b2540]">{r.name}</div>
                    <div className="text-[10px] text-[#9b95ae]">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</div>
                  </div>
                </div>

                <div className="text-[#5b5070]">{r.number}</div>

                <div>
                  <div className="font-medium">{r.intersted}</div>
                </div>

                {/* Status with color */}
                <div>
                  <select
                    value={r.status ?? ''}
                    onChange={(e) => updateTest(r._id, { status: e.target.value })}
                    className={`px-3 py-1 rounded-full text-[12px] border ${getStatusColor(r.status)} cursor-pointer`}
                  >
                    <option value="">-- status --</option>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CRM Status with color */}
                <div>
                  <select
                    value={r.crmStatus ?? ''}
                    onChange={(e) => updateTest(r._id, { crmStatus: e.target.value })}
                    className={`px-3 py-1 rounded-full text-[12px] border ${getCrmColor(r.crmStatus)} cursor-pointer`}
                  >
                    <option value="">-- crm --</option>
                    {crmStatusOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* TIME column */}
                <div className="text-right text-xs text-[#6c6580]">
                  <div className="font-medium text-[#2b2540]">{formatUpdatedAt(r.updatedAt)}</div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && <div className="p-8 text-center text-[#9b95ae]">No results for selected date range.</div>}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[#7f7994]">
            <div>Rows: <strong className="ml-1">{filtered.length}</strong></div>
            <div>{loading ? 'Loading…' : 'All results loaded'}</div>
          </div>

          {error && <div className="mt-2 text-sm text-red-600">Error: {error}</div>}
        </div>
      </div>
    </div>
  );
}
