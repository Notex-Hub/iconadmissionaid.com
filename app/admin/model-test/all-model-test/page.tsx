"use client";

import { ApiResponse, ModelTestItem } from "./components/types/modelTest";
import Loader from "./components/Loader";
import ModelTestTable from "./components/ModelTestTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ModelTestsPage() {
  const [items, setItems] = useState<ModelTestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
  const API_URL = `${API_BASE_URL}/model-test`;

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        const json: ApiResponse = await res.json();
        if (!mounted) return;
        if (!json?.status) {
          setError(json?.message || "API returned an error");
          setItems([]);
        } else {
          setItems(json.data || []);
        }
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || "An unknown error occurred");
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Model Tests</h1>
           
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/model-test/create-model-test")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-sm text-sm"
            >
              + Create Model Test
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="p-6 text-center text-sm text-red-600">
              <div className="mb-3 font-medium">Failed to load data</div>
              <div className="text-xs">{error}</div>
            </div>
          ) : (
            <ModelTestTable items={items} />
          )}
        </div>
      </div>
    </div>
  );
}
