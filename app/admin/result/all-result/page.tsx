'use client';

import React, { useEffect, useMemo, useState } from 'react';

type AnyObj = Record<string, any>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sandbox.iconadmissionaid.com/api/v1';
const UPLOAD_URL = `${API_BASE_URL}/result-list/upload-csv`;
const BASE_URL = `${API_BASE_URL}/result-list`;

// --- Small Toast system (local) ---
type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info' };
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function add(message: string, type: Toast['type'] = 'info', ttl = 4000) {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }
  return { toasts, add, remove: (id: string) => setToasts((t) => t.filter((x) => x.id !== id)) };
}

// If your token is stored in a readable cookie named 'token' (non-HttpOnly), this helper returns it.
// If your cookie is HttpOnly, you CANNOT read it from JS — rely on credentials: 'include' instead.
function getCookieToken(name = 'token') {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const c of cookies) {
    const [k, ...v] = c.split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export default function ResultListManager() {
  const { toasts, add } = useToasts();

  // data
  const [items, setItems] = useState<AnyObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // pagination
  const [limit, setLimit] = useState<number>(50); // default per-page
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // csv file selection
  const [file, setFile] = useState<File | null>(null);
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);

  // columns derived from first item
  const columns = useMemo(() => {
    if (!items || items.length === 0) return [];
    const keys = new Set<string>();
    items.forEach((it) => Object.keys(it).forEach((k) => keys.add(k)));
    return Array.from(keys);
  }, [items]);

  // helper to attach auth header if token accessible
  const makeAuthHeaders = () => {
    const headers: Record<string, string> = {};
    const token = getCookieToken('token'); // change name if your cookie key is different
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // fetch list (include credentials so HttpOnly cookie will be sent)
  async function fetchList(currPage = page, currLimit = limit) {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      q.set('limit', String(currLimit));
      q.set('page', String(currPage));

      const headers = makeAuthHeaders();
      const res = await fetch(`${BASE_URL}?${q.toString()}`, {
        method: 'GET',
        credentials: 'include', // <--- important: send cookies
        headers,
      });

      if (!res.ok) {
        // parse possible JSON error body
        let txt = await res.text();
        try {
          const j = JSON.parse(txt);
          txt = j?.message ?? txt;
        } catch {}
        if (res.status === 403) {
          throw new Error('Access denied (403). You may not be authorized.');
        }
        throw new Error(`Fetch failed: ${res.status} ${txt}`);
      }

      const json = await res.json();
      if (Array.isArray(json)) {
        setItems(json);
        setTotalCount(null);
      } else if (json?.data && Array.isArray(json.data)) {
        setItems(json.data);
        if (typeof json.total === 'number') setTotalCount(json.total);
        else if (json.meta?.total) setTotalCount(Number(json.meta.total));
        else setTotalCount(null);
      } else {
        const arr = Object.values(json).find((v) => Array.isArray(v));
        if (Array.isArray(arr)) {
          setItems(arr as AnyObj[]);
          setTotalCount(null);
        } else {
          setItems([]);
          setTotalCount(null);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch');
      add('Failed to load list: ' + (err.message || ''), 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  // upload CSV (also send credentials)
  async function handleUpload(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!file) {
      add('Please choose a CSV file first', 'error');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const headers = makeAuthHeaders(); // don't set Content-Type — browser will set boundary for FormData
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: fd,
        credentials: 'include',
        headers,
      });

      if (!res.ok) {
        let txt = await res.text();
        try { txt = JSON.parse(txt)?.message ?? txt; } catch {}
        if (res.status === 403) throw new Error('Access denied (403). Check your authorization.');
        throw new Error(`Upload failed: ${res.status} ${txt}`);
      }

      const json = await res.json();
      add(json?.message ?? 'CSV uploaded successfully', 'success');
      setPage(1);
      await fetchList(1, limit);
      setFile(null);
      setPreviewFileName(null);
    } catch (err: any) {
      add('Upload failed: ' + (err.message || ''), 'error');
    } finally {
      setUploading(false);
    }
  }

  // delete all endpoint (must include credentials)
  async function handleDeleteAll() {
    if (!confirm('Are you sure? This will delete ALL result-list records.')) return;
    setDeleting(true);
    try {
      const headers = makeAuthHeaders();
      const res = await fetch(BASE_URL, {
        method: 'DELETE',
        credentials: 'include', // <--- send cookies so server can auth from cookie
        headers,
      });

      if (!res.ok) {
        let txt = await res.text();
        try { txt = JSON.parse(txt)?.message ?? txt; } catch {}
        if (res.status === 403) throw new Error('Access denied (403). You are not authorized to delete.');
        throw new Error(`Delete failed: ${res.status} ${txt}`);
      }

      const json = await res.json();
      add(json?.message ?? 'All items deleted', 'success');
      setPage(1);
      await fetchList(1, limit);
    } catch (err: any) {
      add('Delete failed: ' + (err.message || ''), 'error');
    } finally {
      setDeleting(false);
    }
  }

  // small util: pretty-print JSON cell
  const renderCell = (val: any) => {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') return <pre className="whitespace-pre-wrap max-w-xs text-[11px]">{JSON.stringify(val)}</pre>;
    return String(val);
  };

  const totalPages = totalCount ? Math.max(1, Math.ceil(totalCount / limit)) : null;

  return (
    <div className="p-6">
      {/* Toasts */}
      <div className="fixed right-6 top-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded shadow px-4 py-2 text-sm max-w-sm break-words ${
              t.type === 'success' ? 'bg-green-50 text-green-800' : t.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-slate-50 text-slate-800'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Header / Upload */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Result List Manager</h2>
          <p className="text-sm text-slate-500">Upload CSV, browse results, or delete all entries.</p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleUpload} className="flex items-center gap-3">
            <label className="relative cursor-pointer group">
              <input
                type="file"
                accept=".csv,text/csv"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  setPreviewFileName(f ? f.name : null);
                }}
              />
              <div className="px-4 py-2 bg-white border rounded shadow-sm flex items-center gap-2 hover:bg-gray-50">
                <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-slate-700">Choose CSV</span>
              </div>
            </label>

            <div className="text-xs text-slate-600">{previewFileName ?? 'No file selected'}</div>

            <button
              type="submit"
              disabled={!file || uploading}
              className={`px-4 py-2 rounded text-sm font-medium ${
                file ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </form>

          <button
            onClick={() => {
              if (confirm('Reload list from server?')) fetchList(1, limit);
            }}
            className="px-3 py-2 bg-white border rounded shadow-sm text-sm"
            title="Reload"
          >
            Refresh
          </button>

          <button
            onClick={handleDeleteAll}
            disabled={deleting}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow-sm text-sm"
          >
            {deleting ? 'Deleting…' : 'Delete All'}
          </button>
        </div>
      </div>

      {/* Controls: limit / pagination */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Per page</label>
          <select
            value={String(limit)}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 border rounded text-sm"
          >
            {[10, 25, 50, 100, 250, 500, 1000, 2718].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <div className="text-sm text-slate-500">Showing {items.length} items{totalCount ? ` of ${totalCount}` : ''}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            disabled={page <= 1 || loading}
          >
            Prev
          </button>

          <div className="px-3 py-1 text-sm text-slate-600">Page {page}{totalPages ? ` / ${totalPages}` : ''}</div>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded text-sm"
            disabled={loading || (totalPages ? page >= totalPages : false)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow border">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs text-slate-600">#</th>
              {columns.map((c) => (
                <th key={c} className="text-left px-4 py-3 text-xs text-slate-600">
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={1 + Math.max(1, columns.length)} className="px-4 py-8 text-center text-sm text-slate-500">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={1 + Math.max(1, columns.length)} className="px-4 py-8 text-center text-sm text-slate-500">
                  No results found.
                </td>
              </tr>
            ) : (
              items.map((it, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">{(page - 1) * limit + idx + 1}</td>
                  {columns.map((c) => (
                    <td key={c} className="px-4 py-3 text-sm text-slate-700">
                      {renderCell(it[c])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <div>{error ? `Error: ${error}` : 'Tip: upload CSV to add results'}</div>
        <div>
          {totalCount ? (
            <span>
              Showing {(page - 1) * limit + 1} - {Math.min(totalCount, page * limit)} of {totalCount}
            </span>
          ) : (
            <span>Showing {items.length} items</span>
          )}
        </div>
      </div>
    </div>
  );
}
