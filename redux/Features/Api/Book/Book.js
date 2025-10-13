import { apiSlice } from "../../Slice/BaseUrl";

export const bookApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBook: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
      providesTags: ["Book"],
    }),
    updateBook: builder.mutation({
      query: ({ data, params }) => ({
        url: `/product-category/update-student/${params?.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Book"],
    }),
    deleteBook: builder.mutation({
      query: ({ params }) => ({
        url: `/product-category/delete-student/${params?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
    getAllBookCategory: builder.query({
      query: () => ({
        url: "/product-category",
        method: "GET",
      }),
      providesTags: ["Book"],
    }),
    addBookCategory: builder.mutation({
      query: ({ data }) => ({
        url: `/product-category/cretae-product-category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Book"],
    }),
    updateBookCategory: builder.mutation({
      query: ({ data, params }) => ({
        url: `/product-category/update-student/${params?.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Book"],
    }),
    deleteBookCategory: builder.mutation({
      query: ({ params }) => ({
        url: `/product-category/delete-student/${params?.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllBookQuery,
  useDeleteBookMutation,
  useUpdateBookMutation,
  useGetAllBookCategoryQuery,
  useUpdateBookCategoryMutation,
  useDeleteBookCategoryMutation,
  useAddBookCategoryMutation,
} = bookApi;
