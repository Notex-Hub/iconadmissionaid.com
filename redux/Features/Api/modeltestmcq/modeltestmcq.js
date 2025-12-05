import { apiSlice } from "../../Slice/BaseUrl";

export const modelTestMcqApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllModelMcqTest: builder.query({
      query: (params) => ({
        url: "/model-test-mcq",
        method: "GET",
        params,
      }),
      providesTags: ["ModelTestMcq"],
    }),


 getAllModelCQTest: builder.query({
      query: (params) => ({
        url: "/model-test-cq",
        method: "GET",
        params,
      }),
      providesTags: ["ModelTestCQ"],
    }),

 getAllModelTestFillintheGaps: builder.query({
      query: (params) => ({
        url: "/model-test-gaps",
        method: "GET",
        params,
      }),
      providesTags: ["ModelTestGaps"],
    }),

 getAllModelTestpassege: builder.query({
      query: (params) => ({
        url: "/model-test-passaege",
        method: "GET",
        params,
      }),
      providesTags: ["ModelTestPassege"],
    }),

    
  }),

  overrideExisting: false,
});


export const { useGetAllModelMcqTestQuery, useGetAllModelTestFillintheGapsQuery, useGetAllModelCQTestQuery, useGetAllModelTestpassegeQuery } = modelTestMcqApi;
