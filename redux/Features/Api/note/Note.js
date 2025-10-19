import { apiSlice } from "../../Slice/BaseUrl";

export const noteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNote: builder.query({
      query: (params) => ({
        url: "/note",
        method: "GET",
        params, 
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllNoteQuery } = noteApi;
