import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import Homepage from "@/pages/Homepage";
import Client from "@/pages/Client";
import ClientDetails from "@/pages/ClientDetails";
import Service from "@/pages/Service";
import serviceDetails from "@/pages/serviceDetails";
import Project from "@/pages/Project";
import ProjectDetails from "@/pages/ProjectDetails";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: Homepage,
        index: true,
      },
      {
        Component: Client,
        path: "client",
      },
      {
        Component: ClientDetails,
        path: "client/:id",
      },

      {
        Component: Service,
        path: "service",
      },
      {
        Component: serviceDetails,
        path: "service/:id",
      },
      {
        Component: Project,
        path: "project",
      },
      {
        Component: ProjectDetails,
        path: "project/:id",
      },
    ],
  },
  {
    Component: withAuth(DashboardLayout, role.superAdmin as TRole),
    path: "/admin",
    children: [...generateRoutes(adminSidebarItems)],
  },
  {
    Component: withAuth(DashboardLayout, role.superAdmin as TRole),
    path: "/user",
    children: [...generateRoutes(userSidebarItems)],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
]);
