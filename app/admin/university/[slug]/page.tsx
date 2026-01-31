"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";
import CourseModules from "@/components/modules/page";

export default function UniversityModulesPage() {
  const { slug } = useParams();
  const [university, setUniversity] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleLoading, setModuleLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const res = await axiosInstance.get(`/university/${slug}`);
        setUniversity(res.data.data);
      } catch {
        setError("Failed to fetch university details");
      }
    };

    const fetchModules = async () => {
      try {
        const res = await axiosInstance.get(`/module`);
        setModules(res.data.data || []);
      } catch {
        setError("Failed to fetch modules");
      } finally {
        setModuleLoading(false);
      }
    };

    if (slug) {
      fetchUniversity();
      fetchModules();
      setLoading(false);
    }
  }, [slug]);

  
const university_module = modules?.filter((m) =>
    m?.universityId?.includes(university?._id)
);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!university) return <p className="text-center text-gray-500">University not found</p>;

  return (
    <div className="p-6 card">
      <h1 className="text-2xl font-bold mb-4">{university.name}</h1>
      <p>
        <strong>Total Subject:</strong> {university.total_subject}
      </p>
      <p>
        <strong>Status:</strong> {university.status}
      </p>

      <CourseModules
        modules={university_module}
        isModuleLoading={moduleLoading}
        moduleError={error}
        isAuthorised={true}
        courseId={university._id}
      />
    </div>
  );
}
