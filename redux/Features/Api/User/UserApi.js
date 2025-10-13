import { apiSlice } from "../../Slice/BaseUrl";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        userProfile: builder.query({
            query: (data) => ({
                url: "/user/profile",
                method: "GET",
                body: data,
            }), 
            providesTags: ["User","Student"],
        }),
        
    }),
    overrideExisting: false,
});

export const { useUserProfileQuery} = userApi;
