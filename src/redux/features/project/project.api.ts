import { baseApi } from "@/redux/baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query({
      query: () => ({
        url: "/project",
        method: "GET",
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
      query: ({ projectId, projectData }) => ({
        url: `/project/${projectId}`,
        method: "PUT",
        data: projectData,
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
