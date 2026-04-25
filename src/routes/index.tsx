import { generateRoutes } from "@/utils/generateRoutes";
import { lazyRoute } from "@/utils/lazyRoute";
import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";
import type { TRole } from "@/types";

const App = lazyRoute(() => import("@/App"));
const DashboardLayout = lazyRoute(() => import("@/components/layout/DashboardLayout"));
const Login = lazyRoute(() => import("@/pages/Authenticantion/Login"));
const Register = lazyRoute(() => import("@/pages/Authenticantion/RegisterPage"));
const Homepage = lazyRoute(() => import("@/pages/Homepage"));
const Client = lazyRoute(() => import("@/pages/Client"));
const ClientDetails = lazyRoute(() => import("@/pages/ClientDetails"));
const ServicePage = lazyRoute(() => import("@/pages/ServicePage"), "ServicePage");
const Project = lazyRoute(() => import("@/pages/ProjectPage"));
const ProjectDetails = lazyRoute(() => import("@/pages/ProjectDetails"));
const Employee = lazyRoute(() => import("@/pages/EmployeePage"));
const EmployeeDetails = lazyRoute(() => import("@/pages/Admin/Employee/EmployeeDetails"));
const Contact = lazyRoute(() => import("@/pages/Contact"), "Contact");
const AboutPage = lazyRoute(() => import("@/pages/AboutPage"), "AboutPage");
const UserDetails = lazyRoute(() => import("@/pages/Admin/User/UserDetails"));
const Unauthorized = lazyRoute(() => import("@/pages/Authenticantion/Unauthorized"));
const UserUpdate = lazyRoute(() => import("@/pages/Admin/User/UserUpdate"));
const ServiceDetails = lazyRoute(() => import("@/pages/serviceDetails"));
const AdminServiceDetails = lazyRoute(() => import("@/pages/Admin/Service/ServiceDetails"));
const ServiceUpdate = lazyRoute(() => import("@/pages/Admin/Service/ServiceUpdate"));
const ProjectUpdate = lazyRoute(() => import("@/pages/Admin/Project/ProjectUpdate"));
const UpdateEmployee = lazyRoute(() => import("@/pages/Admin/Employee/UpdateEmployee"));
const UpdateClient = lazyRoute(() => import("@/pages/Admin/Client/UpdateClient"));
const AdminClientDetails = lazyRoute(() => import("@/pages/Admin/Client/ClientDetails"));
const UpdateNews = lazyRoute(() => import("@/pages/Admin/News/UpdateNews"));
const NewsDetails = lazyRoute(() => import("@/pages/Admin/News/NewsDetails"));
const UpdateProduct = lazyRoute(() => import("@/pages/Admin/Product/UpdateProduct"));
const AdminProductDetails = lazyRoute(() => import("@/pages/Admin/Product/ProductDetails"));
const ForgotPasswordPage = lazyRoute(() => import("@/pages/Authenticantion/ForgotPasswordPage"));
const ResetPasswordPage = lazyRoute(() => import("@/pages/Authenticantion/ResetPasswordPage"));
const ProductPage = lazyRoute(() => import("@/pages/ProductPage"));
const ProductDetailsPage = lazyRoute(() => import("@/pages/ProductDetails"));

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
        Component: ProductPage,
        path: "product",
      },
      {
        Component: ProductDetailsPage,
        path: "product/:id",
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
        path: "product/:id/edit",
        Component: UpdateProduct,
      },
      {
        path: "product/:id",
        Component: AdminProductDetails,
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
    Component: ForgotPasswordPage,
    path: "/forgot-password",
  },
  {
    Component: ResetPasswordPage,
    path: "/reset-password",
  },

  {
    Component: Unauthorized,
    path: "/unauthorized",
  },
]);
