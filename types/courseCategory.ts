export interface CourseCategory {
  _id: string;
  title: string;
  cover_photo: string;
  createdBy: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
} 



export interface University {
  _id: string;
  name: string;
  total_subject: number;
  status: "Active" | "Inactive";
  createdBy: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}


export interface Book {
  _id: string;
  title: string;
  pdf: string;
  uploadLink: string;
  description: string;
  trailer: string;
  categoryId: string;
  status: "Active" | "Inactive";
  bookType: string;
  price: number;
  offerPrice?: number;
  stock: string;
  coverPhoto: string;
  createdBy: string;
  isDeleted: boolean;
  tags: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  slug: string;
  __v: number;
}


export type Books = Book[];
