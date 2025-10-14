import { apiSlice } from "../../Slice/BaseUrl";

export const bookApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    myBooks: builder.query({
      query: (params) => ({
        url: "/course/my-course",
        method: "GET",
        params,
      }),
      providesTags: ["Book"],
    }),

    getAllBooks: builder.query({
      query: ({ limit } = {}) => ({
        url: limit ? `/product?limit=${limit}` : `/product`,
        method: "GET",
      }),
      providesTags: ["Book"],
    }),

    getSingleBook: builder.query({
      query: ({ slug }) => ({
        url: `/product/${slug}`,
        method: "GET",
      }),
      providesTags: ["Book"],
    }),

    getAllBookCategory: builder.query({
      query: (params) => ({
        url: "/bookCategory",
        method: "GET",
        params,
      }),
    }),

    getAllBookDetails: builder.query({
      query: (params) => ({
        url: "/book-details",
        method: "GET",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useMyBooksQuery,
  useGetAllBooksQuery,
  useGetSingleBookQuery,
  useGetAllBookCategoryQuery,
  useGetAllBookDetailsQuery,
} = bookApi;
