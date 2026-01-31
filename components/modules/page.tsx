"use client";

import React from "react";
import Link from "next/link";
import { Loader2, List, Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axios";

export interface CourseModulesProps {
  modules: any[];
  isModuleLoading: boolean;
  moduleError: any;
  isAuthorised: boolean;
  courseId: string;
  onModuleDeleted?: () => void;
}

const CourseModules: React.FC<CourseModulesProps> = ({
  modules,
  isModuleLoading,
  moduleError,
  isAuthorised,
  courseId,
  onModuleDeleted,
}) => {
  // 🔥 Delete by slug and refresh
  const handleDelete = async (slug: string, moduleTitle: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete module "${moduleTitle}"?`
    );
    if (!confirmDelete) return;

    try {
      toast({
        title: "Deleting...",
        description: `Deleting "${moduleTitle}" — please wait.`,
      });

      const response = await axiosInstance.delete(`/module/${slug}`);

      if (response?.data?.success) {
        toast({
          title: "Deleted successfully",
          description: `"${moduleTitle}" has been removed.`,
        });

        // 👇 refresh parent data
        if (onModuleDeleted) onModuleDeleted();
      } else {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description:
            response?.data?.message ||
            "Module deletion failed. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Error deleting module:", error);
      toast({
        variant: "destructive",
        title: "Error deleting module",
        description:
          error?.response?.data?.message ||
          "Something went wrong while deleting module.",
      });
    }
  };

  return (
    <div className="card mt-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <List className="h-5 w-5 mr-2 text-primary" />
          Course Modules
        </h2>
        {isAuthorised && (
          <Link href={`/admin/course/create-module?courseId=${courseId}`}>
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Module
            </Button>
          </Link>
        )}
      </div>

      {isModuleLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : moduleError ? (
        <div className="text-center py-8 text-red-500">
          Error loading modules
        </div>
      ) : modules?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No modules found for this course
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module Title</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                {isAuthorised && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((module) => (
                <TableRow key={module._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/course/module/${
                        module._id
                      }?courseId=${courseId}&&moduleName=${encodeURIComponent(
                        module.moduleTitle || ""
                      )}`}
                    >
                      {module.moduleTitle}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {module.universityId?.name || "Unknown"}
                  </TableCell>
                  <TableCell>{module.createdBy?.name || "Unknown"}</TableCell>
                  <TableCell>
                    {moment(module.createdAt).format("MMM DD, YYYY")}
                  </TableCell>
                  {isAuthorised && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/course/create-module?id=${module._id}&&courseId=${courseId}&moduleslug=${module.slug}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() =>
                            handleDelete(module.slug, module.moduleTitle)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CourseModules;
