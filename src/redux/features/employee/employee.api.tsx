import { baseApi } from "@/redux/baseApi";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query({
      query: () => ({
        url: "/employee",
        method: "GET",
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
      query: ({ employeeId, employeeData }) => ({
        url: `/employee/${employeeId}`,
        method: "PUT",
        data: employeeData,
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
