"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Upload } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { useUploadImage } from "@/utils/apis/uploadImage";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleEditor from "../../model-test/subject-details/mcq/components/SimpleEditor";

const formSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters."),
  questionImg: z.string().optional(),
  options: z.array(z.string()).min(2, "At least 2 options are required."),
  correctAnswer: z.string().min(1, "Correct answer is required."),
  explaination: z.string().optional(),
  tags: z.array(z.string()).optional(),
  subject: z.string().optional(),
});

const CreateMCQForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId");
  const mcqId = searchParams.get("id");
  const { toast } = useToast();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optionInput, setOptionInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isLoadingMCQ, setIsLoadingMCQ] = useState(false);
  const [editorKey, setEditorKey] = useState(0); // অপশন এডিটর রিসেট করার জন্য
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      questionImg: "",
      options: [],
      correctAnswer: "",
      explaination: "",
      tags: [],
      subject: "",
    },
  });

  // Fetch User & MCQ Data
  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await axiosInstance.get("/user/profile");
        setUserId(userRes.data.data._id);

        if (mcqId) {
          setIsLoadingMCQ(true);
          const mcqRes = await axiosInstance.get(`/mcq/single/${mcqId}`);
          form.reset(mcqRes.data.data);
          setIsLoadingMCQ(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, [mcqId, form]);

  const addOption = () => {
    // HTML ট্যাগ বাদ দিয়ে চেক করা হচ্ছে ইনপুট খালি কি না
    const cleanText = optionInput.replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return;

    const currentOptions = form.getValues("options") || [];
    form.setValue("options", [...currentOptions, optionInput]);
    setOptionInput("");
    setEditorKey(prev => prev + 1); // Editor রিসেট
  };

  const removeOption = (index: number) => {
    const current = form.getValues("options");
    form.setValue("options", current.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (file: File) => {
    uploadImage(file, {
      onSuccess: (url) => form.setValue("questionImg", url),
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!examId || !userId) return;
    setIsSubmitting(true);
    try {
      const payload = { ...values, examId, insertBy: userId };
      if (mcqId) {
        await axiosInstance.patch(`/mcq/${mcqId}`, payload);
      } else {
        await axiosInstance.post("/mcq/create-mcq", payload);
      }
      router.back();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4  mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{mcqId ? "Update MCQ" : "Create MCQ"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMCQ ? <Loader2 className="animate-spin mx-auto" /> : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* --- Question Section --- */}
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <SimpleEditor 
                          value={field.value} 
                          onChange={field.onChange} 
                          placeholder="Type your question here..." 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- Options Section --- */}
                <FormField
                  control={form.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options (Rich Text)</FormLabel>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2 p-3 border rounded-xl bg-gray-50">
                          <SimpleEditor
                            key={editorKey}
                            value={optionInput}
                            onChange={setOptionInput}
                            placeholder="Type an option..."
                          />
                          <Button type="button" onClick={addOption} className="self-end">
                            <Plus className="w-4 h-4 mr-1" /> Add Option
                          </Button>
                        </div>
                        
                        <div className="grid gap-3">
                          {field.value.map((opt, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                              <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: opt }} />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeOption(index)}
                                className="text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- Correct Answer (Matching Logic) --- */}
                <FormField
                  control={form.control}
                  name="correctAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correct Answer (Exact HTML or Text)</FormLabel>
                      <FormControl>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <option value="">Select Correct Option</option>
                          {form.watch("options").map((opt, i) => (
                            <option key={i} value={opt}>
                              Option {i + 1}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- Explanation --- */}
                <FormField
                  control={form.control}
                  name="explaination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Explanation</FormLabel>
                      <FormControl>
                        <SimpleEditor value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mcqId ? "Update MCQ" : "Save MCQ"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMCQForm;