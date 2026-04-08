import { baseApi } from "@/redux/baseApi";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: (params) => ({
        url: "/employee",
        method: "GET",
        params,
      }),
      providesTags: ["EMPLOYEE"],
    }),

    getSingleEmployee: builder.query({
      query: (id) => ({
        url: `/employee/${id}`,
        method: "GET",
      }),
      providesTags: ["EMPLOYEE"],
    }),

    addEmployee: builder.mutation({
      query: (employeeData) => ({
        url: "/employee/create-employee",
        method: "POST",
        data: employeeData,
      }),
      invalidatesTags: ["EMPLOYEE"],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, data }) => ({
        url: `/employee/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["EMPLOYEE"],
    }),

    deleteEmployee: builder.mutation({
      query: (employeeId) => ({
        url: `/employee/${employeeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EMPLOYEE"],
    }),
  }),
});

export const { useGetAllEmployeesQuery, useGetSingleEmployeeQuery, useAddEmployeeMutation, useUpdateEmployeeMutation, useDeleteEmployeeMutation } =
  employeeApi;
