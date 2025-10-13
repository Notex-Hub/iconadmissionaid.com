import { apiSlice } from "../../Slice/BaseUrl";

export const pdfApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        uploadPdf: builder.mutation({
            query: (data) => ({
                url:`/pdf/upload`,
                method: "POST",
                body: data,
            }),
            // invalidatesTags: ["User","Student"],
        }),

    }),
    overrideExisting: false,
});

export const { useUploadPdfMutation } = pdfApi;
