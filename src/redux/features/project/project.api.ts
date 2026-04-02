import { baseApi } from "@/redux/baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: (params) => ({
        url: "/project",
        method: "GET",
        params,
      }),
      providesTags: ["PROJECT"],
    }),

    getSingleProject: builder.query({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
      }),
      providesTags: ["PROJECT"],
    }),

    addProject: builder.mutation({
      query: (projectData) => ({
        url: "/project/create-project",
        method: "POST",
        data: projectData,
      }),
      invalidatesTags: ["PROJECT"],
    }),

    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PROJECT"],
    }),

    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `/project/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PROJECT"],
    }),
  }),
});

export const { useGetAllProjectsQuery, useGetSingleProjectQuery, useAddProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } =
  projectApi;
