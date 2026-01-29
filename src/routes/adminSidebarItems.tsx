import AdminManagement from "@/pages/Admin/AdminManagement";
import ClientManagement from "@/pages/Admin/ClientManagement";
import ProjectManagement from "@/pages/Admin/ProjectManagement";
import ServicesManagement from "@/pages/Admin/ServicesManagement";
import type { ISidebarItem } from "@/types";

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Admin History",
    items: [
      {
        title: "Admin Management",
        url: "/admin/admin-management",
        component: AdminManagement,
      },
      {
        title: "Client Management",
        url: "/admin/client-management",
        component: ClientManagement,
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
    ],
  },
];
