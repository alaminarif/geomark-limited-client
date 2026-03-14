import { baseApi } from "@/redux/baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addContact: builder.mutation({
      query: (contactData) => ({
        url: "/contact/send-message",
        method: "POST",
        data: contactData,
      }),
      invalidatesTags: ["CONTACT"],
    }),
  }),
});

export const { useAddContactMutation } = contactApi;
