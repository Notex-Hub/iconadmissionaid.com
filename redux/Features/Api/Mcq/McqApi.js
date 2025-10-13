import { apiSlice } from "../../Slice/BaseUrl";

export const mcqApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMcq: builder.query({
      query: (params) => ({
        url: "/mcq",
        method: "GET",
        params,
      }),
      providesTags: ["MCQ"],
    }),

    mcqAttemp: builder.mutation({
      query: (data) => ({
        url: `/mcq-attemp/submit`,
        method: "POST",
        body: data,
      }),
      // Invalidate after mutation so queries will refetch
      invalidatesTags: ["MCQAttemp"],
    }),

    getAllmcqAttemp: builder.query({
      query: (params) => ({
        url: `/mcq-attemp`,
        method: "GET",
        params,
      }),
      providesTags: ["MCQAttemp"],
    }),
  }),

  overrideExisting: false,
});


export const { useGetAllMcqQuery, useMcqAttempMutation, useGetAllmcqAttempQuery } = mcqApi;
