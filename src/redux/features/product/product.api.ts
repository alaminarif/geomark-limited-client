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

    addProduct: builder.mutation({
      query: (productData) => ({
        url: "/product/create-product",
        method: "POST",
        data: productData,
      }),
      invalidatesTags: ["PRODUCT"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PRODUCT"],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCT"],
    }),
  }),
});

export const { useGetAllProductsQuery, useGetSingleProductQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } =
  productApi;
