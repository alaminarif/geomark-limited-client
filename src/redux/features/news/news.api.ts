import { baseApi } from "@/redux/baseApi";

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNewss: builder.query({
      query: (params) => ({
        url: "/news",
        method: "GET",
        params,
      }),
      providesTags: ["NEWS"],
    }),

    getSingleNews: builder.query({
      query: (id) => ({
        url: `/news/${id}`,
        method: "GET",
      }),
      providesTags: ["NEWS"],
    }),

    addNews: builder.mutation({
      query: (newsData) => ({
        url: "/news/create-news",
        method: "POST",
        data: newsData,
      }),
      invalidatesTags: ["NEWS"],
    }),

    updateNews: builder.mutation({
      query: ({ id, newsData }) => ({
        url: `/news/${id}`,
        method: "PATCH",
        data: newsData,
      }),
      invalidatesTags: ["NEWS"],
    }),

    deleteNews: builder.mutation({
      query: (newsId) => ({
        url: `/news/${newsId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NEWS"],
    }),
  }),
});

export const { useGetAllNewssQuery, useGetSingleNewsQuery, useAddNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation } = newsApi;
