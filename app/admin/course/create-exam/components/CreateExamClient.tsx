// components/exam/CreateExamClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "./ImageUpload";
import DescriptionField from "./DescriptionField";
import DepartmentsField from "./DepartmentsField";
import FreePriceField from "./FreePriceField";
import UniversityField from "./UniversityField";
import { useUploadImage } from "@/utils/apis/uploadImage";

/**
 * Zod schema updated with new fields
 */
const formSchema = z.object({
  examTitle: z.string().min(1, "Exam title is required"),
  examType: z.enum(["MCQ", "CQ", "Fill in the gaps"]).default("MCQ"),
  totalQuestion: z.coerce.number().min(1, "Total questions must be at least 1"),
  positiveMark: z.coerce.number().min(0, "Positive mark must be 0 or greater"),
  negativeMark: z.coerce.number().min(0, "Negative mark must be 0 or greater"),
  mcqDuration: z.coerce
    .number()
    .min(1, "MCQ duration must be at least 1 minute"),
  cqMark: z.coerce.number().min(0, "CQ mark must be 0 or greater"),
  cqDuration: z.coerce
    .number()
    .min(0, "CQ exam duration must be 0 or greater")
    .optional(),
  validTime: z.string().nullable().optional(),
  status: z.enum(["drafted", "published"]).default("drafted"),
  scheduleDate: z.string().nullable().optional(),

  // New fields:
  image: z.string().nullable().optional(), // URL returned from upload
  description: z.string().nullable().optional(),
  universityName: z.string().nullable().optional(),
  departmentName: z.array(z.string()).optional(),
  isFree: z.enum(["true", "false"]).default("true"),
  price: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateExamForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId");
  const courseId = searchParams.get("courseId");
  const examId = searchParams.get("id");

  // useUploadImage hook (assumed to return mutate and status)
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      examTitle: "",
      examType: "MCQ",
      totalQuestion: 1,
      positiveMark: 1,
      negativeMark: 0,
      mcqDuration: 60,
      cqMark: 0,
      cqDuration: 0,
      validTime: "",
      status: "drafted",
      scheduleDate: "",
      image: null,
      description: "",
      universityName: "",
      departmentName: [],
      isFree: "true",
      price: "",
    },
  });

  // fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setUserId(res.data.data._id);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user",
        });
      }
    };
    fetchUser();
  }, [toast]);

  // If editing, fetch existing exam and set values
  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return;
      try {
        const res = await axiosInstance.get(`/exam/single-exam/${examId}`);
        const data = res.data.data;
        form.reset({
          examTitle: data.examTitle || "",
          examType: data.examType || "MCQ",
          totalQuestion: data.totalQuestion ?? 1,
          positiveMark: data.positiveMark ?? 1,
          negativeMark: data.negativeMark ?? 0,
          mcqDuration: data.mcqDuration ?? 60,
          cqMark: data.cqMark ?? 0,
          cqDuration: data.cqDuration ?? 0,
          validTime: data.validTime || "",
          status: data.status || "drafted",
          scheduleDate: data.scheduleDate
            ? new Date(data.scheduleDate).toISOString().slice(0, 16)
            : "",
          image: data.image || null,
          description: data.description || "",
          universityName: data.universityName || "",
          departmentName: Array.isArray(data.departmentName)
            ? data.departmentName
            : data.departmentName
            ? [data.departmentName]
            : [],
          isFree: data.isFree === true ? "true" : "false",
          price: data.price ? String(data.price) : "",
        });
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load exam data",
        });
      }
    };
    fetchExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // Helper: ensure description length >= 10
  const validateDescription = (desc?: string | null) => {
    if (!desc) return false;
    return desc.trim().length >= 10;
  };

  const onSubmit = async (values: FormValues) => {
    // client-side checks
    if (!moduleId ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Module ID is required",
      });
      return;
    }

    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID is required",
      });
      return;
    }

    // description check (if using a rich editor, ensure you pass editor HTML into values.description)
    const description = values.description || "";
    if (!validateDescription(description)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Description must be at least 10 characters long",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        ...values,
        moduleId,
        courseId,
        createdBy: userId,
      };

      // Ensure departmentName is array of strings
      if (!payload.departmentName) payload.departmentName = [];

      // Keep isFree as "true"/"false" string as you requested; convert if backend needs boolean
      // payload.isFree = payload.isFree === "true";

      if (examId) {
        await axiosInstance.patch(`/exam/${examId}`, payload);
        toast({
          title: "Exam updated",
          description: "Exam updated successfully",
        });
      } else {
        await axiosInstance.post("/exam/create-exam", payload);
        toast({
          title: "Exam created",
          description: "Exam created successfully",
        });
      }

      router.back();
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: `Error ${examId ? "updating" : "creating"} exam`,
        description: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content px-4 ac-transition">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full">
          <Card>
            <CardHeader>
              <CardTitle>{examId ? "Edit Exam" : "Create New Exam"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* examTitle */}
                    <FormField
                      control={form.control}
                      name="examTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Title</FormLabel>
                          <FormControl>
                            <input
                              {...field}
                              className="input p-2 input-bordered w-full"
                              placeholder="Enter exam title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* examType */}
                    <FormField
                      control={form.control}
                      name="examType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Type</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="input p-2 input-bordered w-full"
                            >
                              <option value="MCQ">MCQ</option>
                              <option value="CQ">CQ</option>
                              <option value="Fill in the gaps">
                                Fill in the gaps
                              </option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* totalQuestion */}
                    <FormField
                      control={form.control}
                      name="totalQuestion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Questions</FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min={1}
                              {...field}
                              className="input p-2 input-bordered w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* mcqDuration */}
                    <FormField
                      control={form.control}
                      name="mcqDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MCQ Duration (minutes)</FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min={1}
                              {...field}
                              className="input p-2 input-bordered w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* positiveMark */}
                    <FormField
                      control={form.control}
                      name="positiveMark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Positive Mark</FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              {...field}
                              className="input p-2 input-bordered w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* negativeMark */}
                    <FormField
                      control={form.control}
                      name="negativeMark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Negative Mark</FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              {...field}
                              className="input p-2 input-bordered w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* cqMark */}
                    <FormField
                      control={form.control}
                      name="cqMark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CQ Mark</FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min={0}
                              {...field}
                              className="input p-2 input-bordered w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* cqDuration */}
                    <FormField
                      control={form.control}
                      name="cqDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CQ Duration (minutes)</FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              min={0}
                              {...field}
                              className="input p-2 input-bordered w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* validTime (datetime-local) */}
                    <FormField
                      control={form.control}
                      name="validTime"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Valid Time</FormLabel>
                          <FormControl>
                            <input
                              type="datetime-local"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(e.target.value || null)
                              }
                              className="input p-2 input-bordered w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="input p-2 input-bordered w-full"
                            >
                              <option value="drafted">Draft</option>
                              <option value="published">Published</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* scheduleDate */}
                    <FormField
                      control={form.control}
                      name="scheduleDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schedule Date</FormLabel>
                          <FormControl>
                            <input
                              type="datetime-local"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value || null)}
                              className="input p-2 input-bordered w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Image Upload (uses uploadImage mutate from useUploadImage) */}
                    <Controller
                      name="image"
                      control={form.control}
                      render={({ field }) => (
                        <ImageUpload
                          value={field.value}
                          onChange={(url) => field.onChange(url)}
                          uploadFn={(file, callbacks) => {
                            try {
                              // use the mutate function: uploadImage(file, { onSuccess, onError })
                              // Note: react-query mutate accepts second param with callbacks
                              uploadImage(file, {
                                onSuccess: (res: any) => {
                                  // server response may contain url in different shapes; extract it:
                                  const url =
                                    res?.data?.url ||
                                    res?.data?.data?.url ||
                                    res?.url ||
                                    (typeof res === "string" ? res : null);
                                  if (url) {
                                    callbacks.onSuccess(url);
                                  } else {
                                    // if mutate's response doesn't include URL, call onError
                                    callbacks.onError(
                                      new Error("Upload succeeded but server did not return file URL")
                                    );
                                  }
                                },
                                onError: (err: any) => {
                                  callbacks.onError(err);
                                },
                              });
                            } catch (err) {
                              callbacks.onError(err);
                            }
                          }}
                        />
                      )}
                    />

                    {/* Description component */}
                    <Controller
                      name="description"
                      control={form.control}
                      render={({ field }) => (
                        <DescriptionField
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    {/* University name */}
                    <Controller
                      name="universityName"
                      control={form.control}
                      render={({ field }) => (
                        <UniversityField
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    {/* Departments tag input */}
                    <Controller
                      name="departmentName"
                      control={form.control}
                      render={({ field }) => (
                        <DepartmentsField
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    {/* isFree + price */}
                    <Controller
                      name="isFree"
                      control={form.control}
                      render={({ field }) => (
                        <FreePriceField
                          isFree={field.value}
                          onChangeIsFree={field.onChange}
                          price={form.getValues("price") || ""}
                          onChangePrice={(p) => form.setValue("price", p)}
                        />
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {examId ? "Updating..." : "Creating..."}
                        </>
                      ) : examId ? (
                        "Update Exam"
                      ) : (
                        "Create Exam"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateExamForm;
