import User from "@/pages/User/user";
import type { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "History Uaser",
    items: [
      {
        title: "Users",
        url: "/user/users",
        component: User,
      },
    ],
  },
];
