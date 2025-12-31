import { createSlice } from '@reduxjs/toolkit';

// Initial state for authentication
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,

  // Registration flow state
  registrationStep: 1, // 1: Basic Info, 2: OTP Verification, 3: Password
  registrationData: {
    phone: null,
    tempToken: null,
  },

  // Loading and error states
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set registration step (1, 2, or 3)
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
      state.error = null;
    },

    // Store phone and tempToken between registration steps
    setRegistrationData: (state, action) => {
      state.registrationData = {
        ...state.registrationData,
        ...action.payload,
      };
    },

    // Set user credentials after successful login/registration
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      // Save token to localStorage
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },

    // Logout user
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.registrationStep = 1;
      state.registrationData = { phone: null, tempToken: null };
      localStorage.removeItem('token');
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error message
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset registration flow
    resetRegistration: (state) => {
      state.registrationStep = 1;
      state.registrationData = { phone: null, tempToken: null };
      state.error = null;
    },
  },
});

export const {
  setRegistrationStep,
  setRegistrationData,
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
  resetRegistration,
} = authSlice.actions;

export default authSlice.reducer;
