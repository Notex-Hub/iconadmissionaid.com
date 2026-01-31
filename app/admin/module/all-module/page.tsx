"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from "@/utils/axios";
import { Loader2, Search } from "lucide-react";
import CourseModules from "@/components/modules/page";
import { Input } from "@/components/ui/input";

export default function UniversityModulesPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchModules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/module`);
      setModules(res.data.data || []);
    } catch {
      setError("Failed to fetch modules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Filter modules
  const filteredModules = useMemo(() => {
    if (!searchTerm) return modules;
    return modules.filter((m) =>
      m?.moduleTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [modules, searchTerm]);

  return (
    <div className="p-6 card">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">All Modules</h1>

        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search module..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <CourseModules
          modules={filteredModules}
          isModuleLoading={loading}
          moduleError={error}
          isAuthorised={true}
          courseId={""}
          // 👇 refresh list after delete
          onModuleDeleted={fetchModules}
        />
      )}
    </div>
  );
}
