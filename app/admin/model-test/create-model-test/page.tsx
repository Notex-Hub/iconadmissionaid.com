"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUploadImage } from "@/utils/apis/uploadImage";
import axiosInstance from "@/utils/axios";
import { useCourseList } from "@/utils/apis/getCourseList";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "@/hooks/use-toast";

type SectionEnglish = "MCQ" | "CQ" | "FillInTheGaps" | "SA";
type SubjectName = "English" | "Math" | "Physics" | "Chemistry";

const API_CREATE_PATH = "/model-test/create-model-test";
const API_GET_PATH = "/model-test";

const notify = {
  success: (msg: string) =>
    toast({ title: "Success", description: msg, variant: "default" }),
  error: (msg: string) =>
    toast({ title: "Error", description: msg, variant: "destructive" }),
};

// ===== Sortable Item Component =====
function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="text-sm px-3 py-1 rounded border bg-gray-100 border-gray-300"
    >
      {id}
    </button>
  );
}

// ===== Main Component =====
function ModelTestFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []); // Hydration Fix

  // Form State
  const [title, setTitle] = useState("");
  const [university, setUniversity] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [deptInput, setDeptInput] = useState("");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [sectionsOrderForEnglish, setSectionsOrderForEnglish] = useState<
    SectionEnglish[]
  >(["MCQ", "CQ", "FillInTheGaps", "SA"]);
  const [sectionsOrderForSubject, setSectionsOrderForSubject] = useState<
    SubjectName[]
  >(["English", "Math", "Physics", "Chemistry"]);
  
  // New fields for testType and pricing
  const [testType, setTestType] = useState<"in-course" | "out-of-course">("out-of-course");
  const [courseId, setCourseId] = useState("");
  const [pricingType, setPricingType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState<number>(0);

  const uploadImageMutation = useUploadImage();

  // ===== Fetch courses for in-course model tests =====
  const { data: coursesData } = useCourseList(1000, 1); // Fetch up to 1000 courses

  // ===== Fetch all model tests for manual find =====
  const { data: allModelTests } = useQuery({
    queryKey: ["allModelTests"],
    queryFn: async () => {
      const res = await axiosInstance.get(API_GET_PATH);
      return res?.data;
    },
  });

  // ===== Populate form if editing =====
  useEffect(() => {
    if (!mounted || !slug || !allModelTests) return;

    const mt = allModelTests?.data?.find((m: any) => m.slug === slug);
    if (mt) {
      setTitle(mt.title);
      setUniversity(mt.university);
      setDepartments(mt.departments || []);
      setCoverPhotoUrl(mt.image || "");
      setSectionsOrderForEnglish(
        mt.sectionsOrderForEnglish || ["MCQ", "CQ", "FillInTheGaps", "SA"]
      );
      setSectionsOrderForSubject(
        mt.sectionsOrderForSubject || [
          "English",
          "Math",
          "Physics",
          "Chemistry",
        ]
      );
      // Populate new fields
      setTestType(mt.testType || "out-of-course");
      setCourseId(mt.courseId || "");
      setPricingType(mt.pricingType || "free");
      setPrice(mt.price || 0);
    }
  }, [slug, allModelTests, mounted]);

  // ===== Department Functions =====
  const addDepartment = () => {
    const val = deptInput.trim();
    if (!val) return;
    setDepartments((s) => Array.from(new Set([...s, val])));
    setDeptInput("");
  };
  const removeDepartment = (d: string) =>
    setDepartments((s) => s.filter((x) => x !== d));

  // ===== Image Upload =====
  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadImageMutation.mutateAsync(file);
      if (url) setCoverPhotoUrl(url);
      notify.success("Cover photo uploaded");
    } catch {
      notify.error("Error uploading image");
    }
  };

  // ===== Create / Update Mutation =====
  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      if (slug) {
        const res = await axiosInstance.patch(
          `${API_GET_PATH}/${slug}`,
          payload
        );
        return res.data;
      } else {
        const res = await axiosInstance.post(API_CREATE_PATH, payload);
        return res.data;
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !university.trim() || departments.length === 0) {
      notify.error("Provide title, university & at least one department");
      return;
    }

    // Validation for testType
    if (testType === "in-course" && !courseId) {
      notify.error("Please select a course for in-course model test");
      return;
    }

    if (testType === "out-of-course" && pricingType === "paid" && price <= 0) {
      notify.error("Please provide a valid price for paid model test");
      return;
    }

    const payload: any = {
      title,
      university,
      departments,
      image: coverPhotoUrl,
      sectionsOrderForEnglish,
      sectionsOrderForSubject,
      testType,
    };

    // Add conditional fields based on testType
    if (testType === "in-course") {
      payload.courseId = courseId;
    } else {
      payload.pricingType = pricingType;
      if (pricingType === "paid") {
        payload.price = price;
      }
    }

    try {
      const result = await createMutation.mutateAsync(payload);
      if (!result?.status) {
        notify.error(result?.message || "Failed to save model test");
        return;
      }
      notify.success(
        slug
          ? "Model Test updated successfully"
          : "Model Test created successfully"
      );
    router.push("/admin/model-test/all-model-test");
    } catch (err: any) {
      notify.error(err?.message || "Failed to save model test");
    }
  };

  const isCreating = createMutation.isPending;
  const sensors = useSensors(useSensor(PointerSensor));

  // ===== Drag Handlers =====
  const handleSectionsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = sectionsOrderForEnglish.indexOf(
        active.id as SectionEnglish
      );
      const newIndex = sectionsOrderForEnglish.indexOf(
        over.id as SectionEnglish
      );
      setSectionsOrderForEnglish(
        arrayMove(sectionsOrderForEnglish, oldIndex, newIndex)
      );
    }
  };

  const handleSubjectsDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = sectionsOrderForSubject.indexOf(
        active.id as SubjectName
      );
      const newIndex = sectionsOrderForSubject.indexOf(over.id as SubjectName);
      setSectionsOrderForSubject(
        arrayMove(sectionsOrderForSubject, oldIndex, newIndex)
      );
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto ">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 underline mb-3"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {slug ? "Edit Model Test" : "Create Model Test"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-sm space-y-4"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="CSE Model Test 2025"
              className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              University
            </label>
            <input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Dhaka University"
              className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Departments */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Departments
            </label>
            <div className="mt-1 flex gap-2">
              <input
                value={deptInput}
                onChange={(e) => setDeptInput(e.target.value)}
                placeholder="Enter department and press Add"
                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addDepartment}
                className="px-3 py-2 bg-indigo-600 text-white rounded text-sm"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {departments.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-xs"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => removeDepartment(d)}
                    className="text-red-500 ml-2"
                  >
                    ×
                  </button>
                </span>
              ))}
              {departments.length === 0 && (
                <div className="text-xs text-gray-400">
                  No departments added yet.
                </div>
              )}
            </div>
          </div>

          {/* Test Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="testType"
                  value="in-course"
                  checked={testType === "in-course"}
                  onChange={(e) => setTestType(e.target.value as "in-course" | "out-of-course")}
                  className="w-4 h-4"
                />
                <span className="text-sm">In-Course (Attached to a Course)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="testType"
                  value="out-of-course"
                  checked={testType === "out-of-course"}
                  onChange={(e) => setTestType(e.target.value as "in-course" | "out-of-course")}
                  className="w-4 h-4"
                />
                <span className="text-sm">Out-of-Course (Standalone)</span>
              </label>
            </div>
          </div>

          {/* Course Selection (only for in-course) */}
          {testType === "in-course" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Course <span className="text-red-500">*</span>
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white"
              >
                <option value="">-- Select a Course --</option>
                {coursesData?.data?.map((course: any) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Students who purchase this course will automatically get access to this model test.
              </p>
            </div>
          )}

          {/* Pricing Type (only for out-of-course) */}
          {testType === "out-of-course" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pricingType"
                    value="free"
                    checked={pricingType === "free"}
                    onChange={(e) => setPricingType(e.target.value as "free" | "paid")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Free</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pricingType"
                    value="paid"
                    checked={pricingType === "paid"}
                    onChange={(e) => setPricingType(e.target.value as "free" | "paid")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Paid</span>
                </label>
              </div>
            </div>
          )}

          {/* Price (only for out-of-course and paid) */}
          {testType === "out-of-course" && pricingType === "paid" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price (BDT) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="500"
                className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* Cover Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cover Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleImageUpload(e.target.files[0])
              }
            />
            {coverPhotoUrl && (
              <img
                src={coverPhotoUrl}
                className="w-24 h-14 object-cover rounded mt-2"
                alt="cover"
              />
            )}
          </div>

          {/* Sections Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sections Order (Drag to Reorder)
            </label>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionsDragEnd}
            >
              <SortableContext
                items={sectionsOrderForEnglish}
                strategy={horizontalListSortingStrategy}
              >
                <div className="mt-2 flex gap-2">
                  {sectionsOrderForEnglish.map((s) => (
                    <SortableItem key={s} id={s} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Subjects Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subjects Order (Drag to Reorder)
            </label>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSubjectsDragEnd}
            >
              <SortableContext
                items={sectionsOrderForSubject}
                strategy={horizontalListSortingStrategy}
              >
                <div className="mt-2 flex gap-2">
                  {sectionsOrderForSubject.map((s) => (
                    <SortableItem key={s} id={s} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Submit / Cancel */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60 text-sm"
            >
              {isCreating
                ? "Saving..."
                : slug
                ? "Update Model Test"
                : "Create Model Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ModelTestForm() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ModelTestFormContent />
    </Suspense>
  );
}
