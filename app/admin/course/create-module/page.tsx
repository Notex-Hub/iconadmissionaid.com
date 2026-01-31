"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axios";
import { Loader2 } from "lucide-react";

// Form schema - only moduleTitle now
const formSchema = z.object({
  moduleTitle: z.string().min(3, {
    message: "Module title must be at least 3 characters.",
  }),
});

const ModuleForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // courseId removed by request
  const moduleId = searchParams.get("id");
  const moduleSlug = searchParams.get("moduleslug");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      moduleTitle: "",
    },
  });

  // Fetch current user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/user/profile");
        setUserId(response.data.data._id);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user information",
        });
      }
    };
    fetchUser();
  }, []);

  // Fetch module data if editing (only title)
  useEffect(() => {
    const fetchModule = async () => {
      if (moduleId && moduleSlug) {
        setIsFetching(true);
        try {
          const response = await axiosInstance.get(`/module/single/${moduleSlug}`);
          const module = response.data?.data;

          form.reset({
            moduleTitle: module?.moduleTitle || "",
          });
        } catch (error: any) {
          console.error("Error fetching module:", error);
          toast({
            variant: "destructive",
            title: "Error fetching module",
            description: error?.response?.data?.message || "Something went wrong",
          });
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, moduleSlug]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("submitted values:", values, { userId });

    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User ID is required",
      });
      return;
    }

    setIsLoading(true);
    try {
      const moduleData: any = {
        moduleTitle: values.moduleTitle,
        createdBy: userId,
      };

      if (moduleId) {
        // Update existing module (no courseId/universityId)
        await axiosInstance.patch(`/module/${moduleSlug}`, moduleData);
        toast({
          title: "Module updated successfully",
          description: "The module has been updated",
        });
      } else {
        // Create new module (no courseId/universityId)
        await axiosInstance.post("/module/create-module", moduleData);
        toast({
          title: "Module created successfully",
          description: "The module has been added",
        });
      }

      router.back();
    } catch (error: any) {
      console.error("Error saving module:", error);
      toast({
        variant: "destructive",
        title: moduleId ? "Error updating module" : "Error creating module",
        description: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-content group-data-[sidebar-size=lg]:xl:ml-[16px] group-data-[sidebar-size=sm]:xl:ml-[16px] px-4 group-data-[theme-width=box]:xl:px-0 ac-transition">
      <div className="card p-6">
        <h6 className="card-title mb-4">
          {moduleId ? "Edit Module" : "Create New Module"}
        </h6>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="moduleTitle">Module Title</Label>
            <Input
              id="moduleTitle"
              placeholder="Enter module title"
              {...form.register("moduleTitle")}
              disabled={isLoading || isFetching}
            />
            {form.formState.errors.moduleTitle && (
              <p className="text-sm text-red-500">
                {form.formState.errors.moduleTitle.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading || isFetching}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isFetching}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {moduleId ? "Update Module" : "Create Module"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateModule: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ModuleForm />
    </Suspense>
  );
};

export default CreateModule;
