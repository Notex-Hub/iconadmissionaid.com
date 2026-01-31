/* eslint-disable react/prop-types */
'use client'
import { FaEdit, FaTrash } from "react-icons/fa";

export interface Banner {
  _id: string;
  image: string;
  link?: string;
  status: string;
}

interface BannerListProps {
  banners: Banner[];
  loading: boolean;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

const BannerList = ({ banners, loading, onEdit, onDelete }: BannerListProps) => {
  if (loading) return <p>Loading banners...</p>;
  if (banners.length === 0)
    return <p className="text-red-500 font-semibold text-center">No banners found!</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-4 border-b">#</th>
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Link</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner, index) => (
            <tr key={banner._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">
                <img
                  src={banner.image}
                  alt="banner"
                  className="h-16 w-32 object-cover rounded"
                />
              </td>
              <td className="py-2 px-4 border-b">{banner.link || "N/A"}</td>
              <td className="py-2 px-4 border-b">{banner.status}</td>
              <td className="py-5 px-4 items-center justify-center flex gap-2">
                <button
                  onClick={() => onEdit(banner)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(banner._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BannerList;
