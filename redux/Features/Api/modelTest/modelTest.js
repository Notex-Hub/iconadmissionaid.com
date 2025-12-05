import { apiSlice } from "../../Slice/BaseUrl";

export const modelTestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllModelTest: builder.query({
      query: (params) => ({
        url: "/model-test",
        method: "GET",
        params,
      }),
      providesTags: ["ModelTest"],
    }),


    
  }),

  overrideExisting: false,
});


export const { useGetAllModelTestQuery} = modelTestApi;
