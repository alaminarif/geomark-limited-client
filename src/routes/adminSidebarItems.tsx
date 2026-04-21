import type { ISidebarItem } from "@/types";
import { lazyRoute } from "@/utils/lazyRoute";

import { Users, BriefcaseBusiness, FolderKanban, Package, UserCog, Handshake, Newspaper } from "lucide-react";

const AdminManagement = lazyRoute(() => import("@/pages/Admin/User/UserManagement"));
const ClientManagement = lazyRoute(() => import("@/pages/Admin/Client/ClientManagement"));
const ProjectManagement = lazyRoute(() => import("@/pages/Admin/Project/ProjectManagement"));
const ServicesManagement = lazyRoute(() => import("@/pages/Admin/Service/ServicesManagement"));
const EmployeeManagement = lazyRoute(() => import("@/pages/Admin/Employee/EmployeeManagement"));
const NewsManagement = lazyRoute(() => import("@/pages/Admin/News/NewsManagement"));
const ProductManagement = lazyRoute(() => import("@/pages/Admin/Product/ProductManagement"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Management",
    items: [
      {
        title: "User Management",
        url: "/admin/user-management",
        component: AdminManagement,
        icon: Users,
        description: "Manage users, roles and permissions",
      },
      {
        title: "Employee Management",
        url: "/admin/employee-management",
        component: EmployeeManagement,
        icon: UserCog,
        description: "Handle internal employee records",
      },
      {
        title: "Client Management",
        url: "/admin/client-management",
        component: ClientManagement,
        icon: Handshake,
        description: "Track and manage client information",
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Services Management",
        url: "/admin/services-management",
        component: ServicesManagement,
        icon: BriefcaseBusiness,
        description: "Manage offered services",
      },
      {
        title: "Project Management",
        url: "/admin/project-management",
        component: ProjectManagement,
        icon: FolderKanban,
        description: "Monitor projects and workflows",
      },
      {
        title: "Product Management",
        url: "/admin/product-management",
        component: ProductManagement,
        icon: Package,
        description: "Control product listings and details",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "News & Updates",
        url: "/admin/news-management",
        component: NewsManagement,
        icon: Newspaper,
        description: "Publish and maintain latest updates",
      },
    ],
  },
];
