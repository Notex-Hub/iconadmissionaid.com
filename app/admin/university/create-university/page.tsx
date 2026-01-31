// components/university/UniversityForm.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axios";
import { Loader2, Check } from "lucide-react";
import ImageUpload from "../../course/create-exam/components/ImageUpload";
import { useUploadImage } from "@/utils/apis/uploadImage";

// Form schema (added image field)
const formSchema = z.object({
  name: z.string().min(3, { message: "University name required." }),
  total_subject: z.string().min(1, { message: "Total subject is required." }),
  status: z.string().min(1, { message: "Status is required" }),
  moduleIds: z.array(z.string()).min(1, { message: "Select at least one module" }),
  image: z.string().nullable().optional(),
});

const UniversityForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const universityId = searchParams.get("id");
  const universitySlug = searchParams.get("universityslug");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [modules, setModules] = useState<{ _id: string; moduleTitle: string; universityId?: string[] }[]>([]);
  const [moduleLoading, setModuleLoading] = useState(true);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // react-query style upload hook
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      total_subject: "",
      status: "",
      moduleIds: [],
      image: null,
    },
  });

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axiosInstance.get("/module");
        setModules(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch modules" });
      } finally {
        setModuleLoading(false);
      }
    };
    fetchModules();
  }, []);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setUserId(res.data.data._id);
      } catch (err) {
        console.error(err);
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch user info" });
      }
    };
    fetchUser();
  }, []);

  // Fetch university AFTER modules loaded
  useEffect(() => {
    if (!universityId || moduleLoading) return;

    const fetchUniversity = async () => {
      setIsFetching(true);
      try {
        const res = await axiosInstance.get(`/university/${universitySlug}`);
        const university = res.data.data;

        const uniId = university._id;

        // Filter modules where this university is included
        const preSelectedModuleIds = modules
          .filter((m) => m.universityId?.includes(uniId))
          .map((m) => m._id);

        form.reset({
          name: university?.name || "",
          total_subject: String(university?.total_subject) || "",
          status: university?.status || "",
          moduleIds: preSelectedModuleIds,
          image: university?.image || null, // set existing image URL if present
        });

        setSelectedModules(preSelectedModuleIds); // Sync local state
      } catch (err) {
        console.error(err);
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch university" });
      } finally {
        setIsFetching(false);
      }
    };

    fetchUniversity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityId, moduleLoading, modules]);

  // Toggle module selection
  const toggleModule = (id: string) => {
    let updated: string[];
    if (selectedModules.includes(id)) {
      updated = selectedModules.filter((mid) => mid !== id);
    } else {
      updated = [...selectedModules, id];
    }
    setSelectedModules(updated);
    form.setValue("moduleIds", updated, { shouldValidate: true });
  };

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) return toast({ variant: "destructive", title: "Error", description: "User ID required" });

    // block submit if image upload running
    if (isUploading) {
      return toast({ variant: "destructive", title: "Please wait", description: "Image upload in progress. Please wait." });
    }

    setIsLoading(true);
    try {
      const universityData: any = {
        name: values.name,
        total_subject: parseInt(values.total_subject, 10),
        status: values.status,
        createdBy: userId,
        modules: values.moduleIds,
        image: values.image || "",
      };

      if (universityId) {
        await axiosInstance.patch(`/university/${universitySlug}`, universityData);
        toast({ title: "University updated", description: "Updated successfully" });
      } else {
        await axiosInstance.post(`/university/create-university`, universityData);
        toast({ title: "University created", description: "Added successfully" });
      }

      router.back();
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Error", description: err?.response?.data?.message || "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  if (moduleLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="main-content px-4 xl:px-0">
      <div className="card p-6">
        <h6 className="card-title mb-4">{universityId ? "Edit University" : "Create University"}</h6>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">University Name *</Label>
            <Input id="name" placeholder="Enter university name" {...form.register("name")} disabled={isLoading || isFetching} />
            {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
          </div>

          {/* Total Subject */}
          <div className="space-y-2">
            <Label htmlFor="total_subject">Total Subject *</Label>
            <Input id="total_subject" type="number" placeholder="Enter total subject" {...form.register("total_subject")} disabled={isLoading || isFetching} />
            {form.formState.errors.total_subject && <p className="text-red-500 text-sm">{form.formState.errors.total_subject.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status *</Label>
            <select className="input" {...form.register("status")} disabled={isLoading || isFetching}>
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {form.formState.errors.status && <p className="text-red-500 text-sm">{form.formState.errors.status.message}</p>}
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label>Image</Label>
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
          </div>

          {/* Modules as Cards */}
          <div className="space-y-2">
            <Label>Modules *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {modules.map((module) => {
                const selected = selectedModules.includes(module._id);
                return (
                  <div
                    key={module._id}
                    onClick={() => toggleModule(module._id)}
                    className={`relative cursor-pointer p-4 border rounded-lg text-center transition-all font-medium
                      ${selected ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}`}
                  >
                    {module.moduleTitle}
                    {selected && <Check className="absolute top-2 right-2 h-5 w-5 text-white" />}
                  </div>
                );
              })}
            </div>
            {form.formState.errors.moduleIds && <p className="text-red-500 text-sm">{form.formState.errors.moduleIds.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading || isFetching || isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isFetching || isUploading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {universityId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateUniversity = () => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }
  >
    <UniversityForm />
  </Suspense>
);

export default CreateUniversity;
