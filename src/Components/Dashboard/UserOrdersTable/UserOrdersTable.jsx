import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useGetOrderQuery } from "../../../../redux/Features/Api/order/orderApi";
import SearchBar from "./SearchBar";
import OrderTable from "./OrderTable";
import OrderCard from "./OrderCard";
import Pagination from "./Pagination";
import downloadFileBlob from "./downloadFileBlob";

const ITEMS_PER_PAGE = 8;

// eslint-disable-next-line no-unused-vars
export default function UserOrdersTable({ compact = false }) {
  const { userInfo } = useSelector((state) => state.auth || {});
  const userId = userInfo?._id || userInfo?.id || null;
  const { data: resp, isLoading, isError } = useGetOrderQuery();
  const ordersRaw = resp?.data ?? [];
  const userOrders = useMemo(() => {
    if (!userId || !ordersRaw.length) return [];
    return ordersRaw.filter((o) => {
      const u = o.userId;
      if (!u) return false;
      if (typeof u === "string") return String(u) === String(userId);
      if (typeof u === "object") return String(u._id || u.id) === String(userId);
      return false;
    });
  }, [ordersRaw, userId]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [query, userId]);
  const filtered = useMemo(() => {
    if (!query) return userOrders;
    const q = String(query).trim().toLowerCase();
    return userOrders.filter((o) => {
      if (String(o._id).toLowerCase().includes(q)) return true;
      if (Array.isArray(o.productId)) {
        for (const p of o.productId) {
          if (String(p.title || "").toLowerCase().includes(q)) return true;
        }
      }
      return false;
    });
  }, [userOrders, query]);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-gray-600">লোড হচ্ছে...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-12 flex items-center justify-center text-red-600">
        সার্ভার থেকে অর্ডার লোড করতে সমস্যা হয়েছে।
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="w-full py-8 text-center text-gray-600">
        লগইন করা নেই — আপনার অর্ডার দেখতে লগইন করুন।
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-500">
        কোনো অর্ডার পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold">Your Orders</h3>
          <div className="text-xs text-gray-500 mt-1">{total} order{total > 1 ? "s" : ""}</div>
        </div>
        <div className="w-full sm:w-80">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      <div className="hidden md:block">
        <OrderTable
          items={pageItems}
          onDownload={(url, name) => downloadFileBlob(url, name)}
        />
      </div>

      <div className="md:hidden space-y-3">
        {pageItems.map((o) => (
          <OrderCard
            key={o._id}
            order={o}
            onDownload={(url, name) => downloadFileBlob(url, name)}
          />
        ))}
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        <div className="text-xs text-gray-400 mt-2">Showing {Math.min(startIdx + 1, total)}–{Math.min(startIdx + pageItems.length, total)} of {total}</div>
      </div>
    </section>
  );
}

UserOrdersTable.propTypes = {
  compact: PropTypes.bool,
};
