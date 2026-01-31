// components/exam/ImageUpload.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { toast } from "@/hooks/use-toast";
import type { AxiosProgressEvent } from "axios";

interface UploadCallbacks {
  onSuccess: (url: string) => void;
  onError: (err: any) => void;
  onProgress?: (percent: number) => void;
}

type UploadFn = (file: File, callbacks: UploadCallbacks) => void;

interface Props {
  value?: string | null; // existing uploaded URL
  onChange: (url: string | null) => void; // called with uploaded URL or null
  uploadFn?: UploadFn; // optional callback-style uploader: uploadFn(file, { onSuccess, onError, onProgress })
  accept?: string;
  label?: string;
  autoUpload?: boolean; // if true, immediately upload on select (default true)
}

const ImageUpload: React.FC<Props> = ({
  value,
  onChange,
  uploadFn,
  accept = "image/*",
  label = "Cover Image",
  autoUpload = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null); // object URL until upload complete
  const inputRef = useRef<HTMLInputElement | null>(null);

  // if parent provides a URL value, prefer that as the preview (server URL)
  useEffect(() => {
    if (value) {
      setLocalPreview(value);
    } else {
      // don't override when user has a local preview set
      if (!localPreview) setLocalPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(localPreview);
        } catch {}
      }
    };
  }, [localPreview]);

  const handleFileSelected = async (file?: File | null) => {
    if (!file) return;

    // show immediate local preview
    const objectUrl = URL.createObjectURL(file);
    // revoke previous blob url if any
    if (localPreview && localPreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(localPreview);
      } catch {}
    }
    setLocalPreview(objectUrl);

    if (autoUpload) {
      await doUpload(file);
    } else {
      // if not autoUpload, keep local preview and let parent handle upload on submit
      // parent can also call onChange with URL when they upload later
    }
  };

  const doUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const finishSuccess = (url: string) => {
      // revoke blob preview if present
      if (localPreview && localPreview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(localPreview);
        } catch {}
      }
      setLocalPreview(url);
      onChange(url);
      setUploading(false);
      setProgress(null);
      toast({ title: "Uploaded", description: "Image uploaded successfully" });
    };

    const finishError = (err: any) => {
      console.error("Upload error:", err);
      setUploading(false);
      setProgress(null);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err?.message || err?.response?.data?.message || "Something went wrong",
      });
    };

    // If custom uploadFn provided (callback-style), use it
    if (uploadFn) {
      try {
        uploadFn(file, {
          onSuccess: (url) => finishSuccess(url),
          onError: (err) => finishError(err),
          onProgress: (pct) => {
            setProgress(Math.round(pct));
          },
        });
      } catch (err) {
        finishError(err);
      }
      return;
    }

    // Fallback: use axiosInstance.post("/upload")
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await axiosInstance.post("/upload/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          // AxiosProgressEvent has optional loaded/total fields
          const loaded = progressEvent?.loaded ?? 0;
          const total = progressEvent?.total ?? 0;
          if (total > 0) {
            const pct = Math.round((loaded * 100) / total);
            setProgress(pct);
          }
        },
      });

      const url =
        res?.data?.url ||
        res?.data?.data?.url ||
        res?.data?.data?.fileUrl ||
        null;

      if (!url) {
        finishError(new Error("Server did not return uploaded file URL. Adjust endpoint/response handling."));
        return;
      }

      finishSuccess(url);
    } catch (err: any) {
      finishError(err);
    }
  };

  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="flex gap-3 items-center">
        <input
          ref={inputRef}
          id="file_input"
          type="file"
          accept={accept}
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            handleFileSelected(f);
            // clear input to allow same file to be picked again if needed
            if (inputRef.current) inputRef.current.value = "";
          }}
        />

        {uploading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {progress !== null ? <span className="text-sm">{progress}%</span> : <span className="text-sm">Uploading...</span>}
          </div>
        )}

        {localPreview && !uploading && (
          <div className="relative inline-block">
            <img src={localPreview} alt="preview" className="h-20 w-32 object-cover rounded-md border" />
            <button
              type="button"
              onClick={() => {
                // revoke blob URL if needed
                if (localPreview && localPreview.startsWith("blob:")) {
                  try {
                    URL.revokeObjectURL(localPreview);
                  } catch {}
                }
                setLocalPreview(null);
                onChange(null);
              }}
              className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow"
              aria-label="Remove image"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
