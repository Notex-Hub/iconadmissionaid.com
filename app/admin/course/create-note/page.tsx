"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUploadPdf } from "@/utils/apis/uploadPdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, FileText, X } from "lucide-react";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Status is required"),
  scheduleDate: z.string().min(1, "Schedule date is required"),
});

const CreateNoteContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // CHANGED: Use an array for multiple PDF URLs
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);

  const { mutate: uploadPdf, isPending: isPdfUploading } = useUploadPdf();

  const courseId = searchParams.get("courseId");
  const moduleId = searchParams.get("moduleId");
  const noteId = searchParams.get("id");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      scheduleDate: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axiosInstance.get("/user/profile");
        setUserProfile(userResponse.data.data);

        if (noteId) {
          setIsLoading(true);
          const noteResponse = await axiosInstance.get(`/note/single-note/${noteId}`);
          const noteData = noteResponse.data.data;

          form.reset({
            title: noteData.title ?? "",
            description: noteData.description ?? "",
            status: noteData.status ?? "",
            scheduleDate: noteData.scheduleDate
              ? new Date(noteData.scheduleDate).toISOString().slice(0, 16)
              : "",
          });

          // CHANGED: Set array of files from noteData.noteFile (assuming it's an array now)
          if (Array.isArray(noteData.noteFile)) {
            setPdfUrls(noteData.noteFile);
          } else if (noteData.noteFile) {
            setPdfUrls([noteData.noteFile]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsUserLoading(false);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [noteId]);

  // Function to handle single file upload promise
  const handleSinglePdfUpload = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      uploadPdf(file, {
        onSuccess: (res: any) => {
          const url = res?.secure_url ?? res?.url;
          if (url) resolve(url);
          else reject(new Error("No URL returned"));
        },
        onError: (err) => reject(err),
      });
    });
  };

  const removePdf = (indexToRemove: number) => {
    setPdfUrls((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(pdfUrls);
    if (pdfUrls.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload at least one PDF file",
      });
      return;
    }

    const noteData = {
      ...values,
      createdBy: userProfile?._id,
      courseId,
      moduleId,
      noteFile: pdfUrls,
    };

    try {
      if (noteId) {
        await axiosInstance.put(`/note/${noteId}`, noteData);
        toast({ title: "Success", description: "Note updated successfully" });
      } else {
        await axiosInstance.post("/note/create-note", noteData);
        toast({ title: "Success", description: "Note created successfully" });
      }
      router.back();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save note" });
    }
  };

  if (isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="main-content px-4 ac-transition">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-r from-primary/90 to-primary p-6 flex items-center">
              <Link href="/admin/course/notes">
                <Button variant="ghost" size="icon" className="mr-4"><ArrowLeft /></Button>
              </Link>
              <h1 className="text-2xl font-bold">{noteId ? "Edit Note" : "Create Note"}</h1>
            </div>
          </div>

          <div className="card mt-6 p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title & Status & Date (Kept same as your code) */}
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Note Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="scheduleDate" render={({ field }) => (
                    <FormItem><FormLabel>Schedule Date</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  {/* MULTI PDF UPLOAD SECTION */}
                  <div className="col-span-full">
                    <FormLabel>Note Files (PDFs)</FormLabel>
                    
                    {/* List of uploaded files */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      {pdfUrls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-5 w-5 text-primary shrink-0" />
                            <span className="text-xs truncate max-w-[200px]">Note_{index + 1}.pdf</span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removePdf(index)}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Upload Input */}
                    <label
                      htmlFor="pdfFile"
                      className="mt-4 cursor-pointer p-8 flex flex-col items-center justify-center border-2 border-dashed rounded-lg hover:bg-muted/50 transition"
                    >
                      <input
                        type="file"
                        id="pdfFile"
                        className="hidden"
                        accept=".pdf"
                        multiple // ALLOW MULTIPLE SELECTION
                        disabled={isPdfUploading}
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;

                          try {
                            const uploadPromises = files.map(file => handleSinglePdfUpload(file));
                            const newUrls = await Promise.all(uploadPromises);
                            setPdfUrls(prev => [...prev, ...newUrls]);
                            toast({ title: "Success", description: `${files.length} file(s) uploaded.` });
                          } catch (err) {
                            toast({ variant: "destructive", title: "Upload failed", description: "Some files failed to upload." });
                          }
                          e.target.value = ""; // reset input
                        }}
                      />
                      {isPdfUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      ) : (
                        <div className="text-center">
                          <FileText className="mx-auto h-8 w-8 text-gray-400" />
                          <span className="mt-2 block text-sm font-semibold">Click to upload multiple PDFs</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                )} />

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                  <Button type="submit" disabled={isPdfUploading}>
                    {isPdfUploading ? "Uploading..." : noteId ? "Update Note" : "Create Note"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateNote = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CreateNoteContent />
    </Suspense>
  );
};

export default CreateNote;



