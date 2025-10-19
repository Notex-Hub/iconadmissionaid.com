import { apiSlice } from "../../Slice/BaseUrl";

export const imgApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        uploadImg: builder.mutation({
            query: (data) => ({
                url:`/images/upload`,
                method: "POST",
                body: data,
            }),
        }),

    }),
    overrideExisting: false,
});

export const { useUploadImgMutation } = imgApi;
