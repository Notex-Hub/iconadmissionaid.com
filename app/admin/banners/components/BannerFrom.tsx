/* eslint-disable react/prop-types */
'use client'
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useUploadImage } from "@/utils/apis/uploadImage";
import axiosInstance from "@/utils/axios";
import { Banner } from "./Bannerlist";
import { Button } from "@/components/ui/button"; // যদি তুমি tailwind + custom button ব্যবহার করো
import { Loader2 } from "lucide-react"; // loader icon

interface BannerFormProps {
  initialData?: Banner | null;
  onSuccess?: () => void;
}

const BannerForm = ({ initialData, onSuccess }: BannerFormProps) => {
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(initialData?.image || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [status, setStatus] = useState(initialData?.status || "Active");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { mutate: uploadImage } = useUploadImage();

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      await uploadImage(file, {
        onSuccess: (url: string) => {
          setCoverPhotoUrl(url);
          setUploading(false);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: "Failed to upload image",
          });
          setUploading(false);
        },
      });
    } catch (error) {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!coverPhotoUrl) {
      toast({ variant: "destructive", title: "Image required" });
      return;
    }
    try {
      setLoading(true);
      if (initialData?._id) {
        await axiosInstance.patch(`/banner/${initialData._id}`, {
          image: coverPhotoUrl,
          link,
          status,
        });
      } else {
        await axiosInstance.post("/banner/create-banner", {
          image: coverPhotoUrl,
          link,
          status,
        });
      }
      toast({ title: `Banner ${initialData?._id ? "updated" : "created"} successfully` });
      onSuccess?.();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save banner" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-3">
      {/* Banner Image Upload */}
      <div>
        <label className="block font-semibold mb-1">Banner Image</label>
        {coverPhotoUrl ? (
          <div className="relative aspect-[4/1.5] rounded-md overflow-hidden mb-4">
            <img
              src={coverPhotoUrl}
              alt="banner"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setCoverPhotoUrl("")}
            >
              Remove
            </Button>
          </div>
        ) : (
          <label
            htmlFor="banner-upload"
            className="file-container ac-bg text-xs leading-none font-semibold mb-3 cursor-pointer aspect-[4/1.5] flex flex-col items-center justify-center gap-2.5 border border-dashed border-gray-900 rounded-lg"
          >
            <input
              type="file"
              id="banner-upload"
              className="hidden"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await handleImageUpload(file);
                }
              }}
              disabled={uploading}
            />
            <div className="flex flex-col items-center">
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <>
                  <div className="size-10 lg:size-15 flex items-center justify-center bg-gray-200 rounded-full">
                    <span className="text-gray-500">Upload</span>
                  </div>
                  <span className="mt-2 text-gray-500">Choose file( max 1 MB)</span>
                </>
              )}
            </div>
          </label>
        )}
      </div>

      {/* Link Input */}
      <div>
        <label className="block font-semibold mb-1">Link</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block font-semibold mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {initialData?._id ? "Update Banner" : "Create Banner"}
      </button>
    </form>
  );
};

export default BannerForm;
