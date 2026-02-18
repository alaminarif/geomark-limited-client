import { baseApi } from "@/redux/baseApi";

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => ({
        url: "/service",
        method: "GET",
      }),
      providesTags: ["SERVICE"],
    }),

    getSingleService: builder.query({
      query: (id) => ({
        url: `/service/${id}`,
        method: "GET",
      }),
      providesTags: ["SERVICE"],
    }),

    addService: builder.mutation({
      query: (serviceData) => ({
        url: "/service/create-service",
        method: "POST",
        data: serviceData,
      }),
      invalidatesTags: ["SERVICE"],
    }),

    updateService: builder.mutation({
      query: ({ serviceId, serviceData }) => ({
        url: `/service/${serviceId}`,
        method: "PUT",
        data: serviceData,
      }),
      invalidatesTags: ["SERVICE"],
    }),

    deleteService: builder.mutation({
      query: (clientId) => ({
        url: `/client/${clientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CLIENT"],
    }),
  }),
});

export const { useGetAllServicesQuery, useGetSingleServiceQuery, useAddServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } =
  serviceApi;
