/* eslint-disable react/prop-types */
'use client'
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import BannerList, { Banner } from "./Bannerlist";
import BannerForm from "./BannerFrom";


const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/banner");
      setBanners(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!window.confirm("Are you sure to delete this banner?")) return;
    try {
      await axiosInstance.delete(`/banner/${id}`);
      fetchBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setModalOpen(true);
  };

  const handleSuccess = () => {
    setModalOpen(false);
    fetchBanners();
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Banners</h2>
        <div className="flex gap-2">
          <button onClick={openCreateModal} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Create Banner</button>
          <button onClick={fetchBanners} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Reload</button>
        </div>
      </div>

      <BannerList
        banners={banners}
        loading={loading}
        onEdit={openEditModal}
        onDelete={deleteBanner}
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">✕</button>
            <BannerForm initialData={editingBanner} onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;
