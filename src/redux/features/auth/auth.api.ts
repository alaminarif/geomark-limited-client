import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: userInfo,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: emailData,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ id, token, newPassword }: { id: string; token: string; newPassword: string }) => ({
        url: `/auth/reset-password?id=${id}&token=${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER"],
    }),

    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        data: userInfo,
      }),
    }),

    userInfo: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
  }),
});

export const { useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation, useLoginMutation, useUserInfoQuery, useLogoutMutation } =
  authApi;
