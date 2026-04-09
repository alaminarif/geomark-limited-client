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
import Homepage from "@/pages/Homepage";
import Client from "@/pages/Client";
import ClientDetails from "@/pages/ClientDetails";

import { ServicePage } from "@/pages/ServicePage";
import Project from "@/pages/ProjectPage";
import ProjectDetails from "@/pages/ProjectDetails";
import Employee from "@/pages/EmployeePage";
import EmployeeDetails from "@/pages/Admin/Employee/EmployeeDetails";
import { Contact } from "@/pages/Contact";
import { AboutPage } from "@/pages/AboutPage";
import UserDetails from "@/pages/Admin/User/UserDetails";
import Unauthorized from "@/pages/Unauthorized";
import type { TRole } from "@/types";
import UserUpdate from "@/pages/Admin/User/UserUpdate";
import ServiceDetails from "@/pages/serviceDetails";
import AdminServiceDetails from "@/pages/Admin/Service/ServiceDetails";
import ServiceUpdate from "@/pages/Admin/Service/ServiceUpdate";
import ProjectUpdate from "@/pages/Admin/Project/ProjectUpdate";
import UpdateEmployee from "@/pages/Admin/Employee/UpdateEmployee";
import UpdateClient from "@/pages/Admin/Client/UpdateClient";
import AdminClientDetails from "@/pages/Admin/Client/ClientDetails";
import UpdateNews from "@/pages/Admin/News/UpdateNews";
import NewsDetails from "@/pages/Admin/News/NewsDetails";

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
        Component: ServicePage,
        path: "services",
      },
      {
        Component: ServiceDetails,
        path: "service/:id",
      },
      {
        Component: Project,
        path: "projects",
      },
      {
        Component: ProjectDetails,
        path: "project/:id",
      },
      {
        Component: Employee,
        path: "employees",
      },
      {
        Component: EmployeeDetails,
        path: "employee/:id",
      },
      {
        Component: Contact,
        path: "contact",
      },
      {
        Component: AboutPage,
        path: "about",
      },
    ],
  },

  {
    Component: withAuth(DashboardLayout, [role.superAdmin, role.admin] as TRole[]),
    path: "/admin",
    children: [
      ...generateRoutes(adminSidebarItems),

      {
        path: "user/:id/edit",
        Component: UserUpdate,
      },
      {
        path: "user/:id",
        Component: UserDetails,
      },
      {
        path: "employee/:id",
        Component: EmployeeDetails,
      },
      {
        path: "employee/:id/edit",
        Component: UpdateEmployee,
      },
      {
        path: "client/:id",
        Component: AdminClientDetails,
      },
      {
        path: "client/:id/edit",
        Component: UpdateClient,
      },
      {
        path: "service/:id/edit",
        Component: ServiceUpdate,
      },
      {
        path: "service/:id",
        Component: AdminServiceDetails,
      },
      {
        path: "project/:id/edit",
        Component: ProjectUpdate,
      },
      {
        path: "news/:id",
        Component: NewsDetails,
      },
      {
        path: "news/:id/edit",
        Component: UpdateNews,
      },
    ],
  },

  {
    Component: withAuth(DashboardLayout, role.user as TRole),
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
  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
]);
