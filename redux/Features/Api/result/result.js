import { apiSlice } from "../../Slice/BaseUrl";

export const resultApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllResult: builder.query({
      query: (testPass) => ({
        url: "/result-list",
        method: "GET",
        params: { testPass },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllResultQuery } = resultApi;
