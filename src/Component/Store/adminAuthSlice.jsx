import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("adminToken");

const adminAuthSlice = createSlice({
  name: "AdminAuth",
  initialState: {
    isAuthenticated: !!token,
    token: token || null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem("adminToken", action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const  adminAuthActions = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
