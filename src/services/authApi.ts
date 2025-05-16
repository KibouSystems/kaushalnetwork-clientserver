import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://69.62.79.102:3000/api/v0/' }),
  endpoints: builder => ({
    loginCompanyUser: builder.mutation({
      query: credentials => ({
        url: 'company-user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginCompanyUserMutation } = authApi;
