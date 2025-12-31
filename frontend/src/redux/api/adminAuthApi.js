import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./config";

export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/admin/admin/login', // Based on current route nesting
        method: 'POST',
        body: data,
      })
    })
  })
});

export const { useLoginMutation } = adminAuthApi;