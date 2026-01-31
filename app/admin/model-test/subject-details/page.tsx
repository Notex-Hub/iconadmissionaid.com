"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { SubjectHeader } from "./components/SubjectHeader";
import { QuickActions } from "./components/QuickActions";
import { SectionCard } from "./components/SectionCard";
import { CreateModal } from "./components/CreateModal";
import { SectionKey } from "./sectionMeta";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://sandbox.iconadmissionaid.com/api/v1";
const SUBJECTS_URL = `${API_BASE_URL}/model-test-subject`;
const MODELS_URL = `${API_BASE_URL}/model-test`;

function SubjectDetailsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const subjectsQuery = useQuery({
    queryKey: ["modelTestSubjects"],
    queryFn: async () => (await axiosInstance.get(SUBJECTS_URL)).data,
  });
  const modelsQuery = useQuery({
    queryKey: ["modelTests"],
    queryFn: async () => (await axiosInstance.get(MODELS_URL)).data,
  });

  const subject = useMemo(
    () => subjectsQuery.data?.data?.find((s: any) => s.slug === slug) ?? null,
    [subjectsQuery.data, slug]
  );
  const modelTest = useMemo(
    () =>
      subject?.modelTest ??
      modelsQuery.data?.data?.find(
        (m: any) => m?.slug === (subject?.modelTest?.slug ?? "")
      ),
    [subject, modelsQuery.data]
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createSection, setCreateSection] = useState<SectionKey | null>(null);
  const openCreateModal = (s: SectionKey) => {
    setCreateSection(s);
    setCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setCreateSection(null);
    setCreateModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto">
        <SubjectHeader
          subject={subject}
          modelTest={modelTest}
          slug={slug}
          router={router}
          onRefresh={() => {
            subjectsQuery.refetch();
            modelsQuery.refetch();
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActions
            slug={slug}
            onCreate={openCreateModal}
            subject={subject}
          />

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["MCQ", "CQ", "FillInTheGaps", "Passage"] as SectionKey[]).map(
              (sec) => (
                <SectionCard
                  key={sec}
                  section={sec}
                  subjectSlug={slug}
                  counts={null}
                  onCreateOpen={openCreateModal}
                  subject={subject}
                />
              )
            )}

            <div className="mt-6 bg-white border rounded-lg p-4 shadow-sm col-span-full">
              <h4 className="text-sm font-medium text-gray-900">
                Recent activity
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                Recent questions / edits will show here once implemented.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CreateModal
        open={createModalOpen}
        section={createSection}
        subjectSlug={slug}
        onClose={closeCreateModal}
      />
    </div>
  );
}

export default function SubjectDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SubjectDetailsPageContent />
    </Suspense>
  );
}
