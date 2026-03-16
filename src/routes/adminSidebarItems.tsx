import AdminManagement from "@/pages/Admin/UserManagement";
import ClientManagement from "@/pages/Admin/ClientManagement";
import ProjectManagement from "@/pages/Admin/ProjectManagement";
import ServicesManagement from "@/pages/Admin/ServicesManagement";
import type { ISidebarItem } from "@/types";
import EmployeeManagement from "@/pages/Admin/EmployeeManagement";
import NewsManagement from "@/pages/Admin/NewsManagement";
import ProductManagement from "@/pages/Admin/ProductManagement";

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "User Management",
        url: "/admin/user-management",
        component: AdminManagement,
      },

      {
        title: "Services Management",
        url: "/admin/services-management",
        component: ServicesManagement,
      },
      {
        title: "Project Management",
        url: "/admin/project-management",
        component: ProjectManagement,
      },
      {
        title: "Product Management",
        url: "/admin/product-management",
        component: ProductManagement,
      },
      {
        title: "Employee Management",
        url: "/admin/employee-management",
        component: EmployeeManagement,
      },
      {
        title: "Client Management",
        url: "/admin/client-management",
        component: ClientManagement,
      },
      {
        title: "News And Update Management",
        url: "/admin/news-management",
        component: NewsManagement,
      },
    ],
  },
];
