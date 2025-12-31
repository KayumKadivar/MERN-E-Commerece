import { createSlice } from "@reduxjs/toolkit";
import { adminAuthApi } from "../api/adminAuthApi";

const initialState = {
  user: null,
  token: localStorage.getItem("adminToken") || null, // Separate token for admin
  isAuthenticated: false,
  loading: false,
  error: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      if (action.payload.token) {
        localStorage.setItem('adminToken', action.payload.token);
      }
    },
    logoutAdmin: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        adminAuthApi.endpoints.login.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        adminAuthApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          if (action.payload.token) {
            localStorage.setItem('adminToken', action.payload.token);
          }
        }
      )
      .addMatcher(
        adminAuthApi.endpoints.login.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || action.payload?.message || "Login failed";
        }
      );
  }
});

export const { setCredentials, logoutAdmin, clearError } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;