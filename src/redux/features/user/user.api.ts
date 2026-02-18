import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "user/all-users",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    getSingleUser: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/user/${userId}`,
        method: "PUT",
        data: userData,
      }),
      invalidatesTags: ["USER"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetSingleUserQuery, useUpdateUserMutation, useDeleteUserMutation } = userApi;
