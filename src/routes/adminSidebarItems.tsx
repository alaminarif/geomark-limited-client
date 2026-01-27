import Admin from "@/pages/Admin/Admin";
import type { ISidebarItem } from "@/types";

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Admin History",
    items: [
      {
        title: "Admins",
        url: "/admin/admin",
        component: Admin,
      },
    ],
  },
];
