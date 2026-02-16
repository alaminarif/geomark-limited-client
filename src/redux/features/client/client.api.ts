import { baseApi } from "@/redux/baseApi";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: () => ({
        url: "/client",
        method: "GET",
      }),
      providesTags: ["CLIENT"],
    }),

    getSingleClient: builder.query({
      query: (id) => ({
        url: `/client/${id}`,
        method: "GET",
      }),
      providesTags: ["CLIENT"],
    }),

    addClient: builder.mutation({
      query: (clientData) => ({
        url: "/create-client",
        method: "POST",
        data: clientData,
      }),
      invalidatesTags: ["CLIENT"],
    }),

    updateClient: builder.mutation({
      query: ({ clientId, clientData }) => ({
        url: `/clients/${clientId}`,
        method: "PUT",
        data: clientData,
      }),
      invalidatesTags: ["CLIENT"],
    }),

    deleteClient: builder.mutation({
      query: (clientId) => ({
        url: `/client/${clientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CLIENT"],
    }),
  }),
});

export const { useGetClientsQuery, useGetSingleClientQuery, useAddClientMutation, useUpdateClientMutation, useDeleteClientMutation } = clientApi;
