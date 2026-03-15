import { baseApi } from "@/redux/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
      providesTags: ["PRODUCT"],
    }),

    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: ["PRODUCT"],
    }),

    addproduct: builder.mutation({
      query: (productData) => ({
        url: "/product/create-news",
        method: "POST",
        data: productData,
      }),
      invalidatesTags: ["PRODUCT"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, productData }) => ({
        url: `/product/${productId}`,
        method: "PUT",
        data: productData,
      }),
      invalidatesTags: ["PRODUCT"],
    }),

    deleteProduct: builder.mutation({
      query: (newsId) => ({
        url: `/product/${newsId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT"],
    }),
  }),
});

export const { useGetAllProductsQuery, useGetSingleProductQuery, useAddproductMutation, useUpdateProductMutation, useDeleteProductMutation } =
  productApi;
