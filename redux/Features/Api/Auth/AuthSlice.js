import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isLoading: true,
  userInfo: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userloading: (state) => {
      state.isLoading = false;
    },
    userLoggedIn: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
    },
    userLoggedOut: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.clear();
    },
  },
});

export const { userLoggedIn, userLoggedOut, userloading } = authSlice.actions;
export default authSlice.reducer;
