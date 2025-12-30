import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_URL } from "./config";

export const userAuthApi = createApi({
  reducerPath: 'userAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: AUTH_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    // Step 1: Send OTP
    sendOtp: builder.mutation({
      query: (data) => ({
        url: '/send-otp',
        method: 'POST',
        body: data,
      })
    }),
    // Step 2: Verify OTP 
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/verify-otp',
        method: 'POST',
        body: data,
      })
    }),
    // Step 3: Register User 
    registerUser: builder.mutation({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: data,
      })
    }),
    // Step 4: Resend OTP 
    resendOtp: builder.mutation({
      query: (data) => ({
        url: '/resend-otp',
        method: 'POST',
        body: data,
      })
    }),
  })
})

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterUserMutation,
  useResendOtpMutation,
} = userAuthApi;
