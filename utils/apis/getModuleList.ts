import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";

export interface Module {
  _id: string;
  moduleTitle: string;
  universityId: {
    _id: string;
    title:string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    profile_picture: string;
    status: string;
    isDeleted: boolean;
    pin: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export const getModuleList = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/module?universityId=${courseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useModuleList = (courseId: string) => {
  return useQuery({
    queryKey: ["modules", courseId],
    queryFn: () => getModuleList(courseId),
    enabled: !!courseId,
  });
};
