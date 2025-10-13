// src/redux/features/api/blog/blogApi.js
import { apiSlice } from "../../Slice/BaseUrl";

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Get All Blog Categories
    getAllBlogCategory: builder.query({
      query: () => "/blog-category",
      providesTags: ["BlogCategory"],
    }),

    // Add Blog Category
    addBlogCategory: builder.mutation({
      query: ({ data }) => ({
        url: "/blog-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BlogCategory"],
    }),

    // Update Blog Category
    updateBlogCategory: builder.mutation({
      query: ({ params, data }) => ({
        url: `/blog-category/${params?.slug}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BlogCategory"],
    }),

    // Delete Blog Category
    deleteBlogCategory: builder.mutation({
      query: (params) => ({
        url: `/blog-category/${params?.slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogCategory"],
    }),

    // Get All Blogs
    getAllBlogs: builder.query({
      query: () => "/blog",
      providesTags: ["Blog"],
    }),

    // Add Blog
    addBlog: builder.mutation({
      query: ({ data }) => ({
        url: "/blog/create-blog",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Get Single Blog by slug
    getBlogData: builder.query({
      query: (slug) => `/blog/${slug}`,
      providesTags: ["Blog"],
    }),

    // Update Single Blog
    updateBlog: builder.mutation({
      query: ({ params, data }) => ({
        url: `/blog/${params?.slug}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Delete Single Blog
    deleteBlog: builder.mutation({
      query: (params) => ({
        url: `/blog/${params?.slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for components
export const {
  useGetAllBlogsQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogDataQuery,
  useGetAllBlogCategoryQuery,
  useAddBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogApi;
