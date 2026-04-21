import type { ISidebarItem } from "@/types";
import { lazyRoute } from "@/utils/lazyRoute";

const User = lazyRoute(() => import("@/pages/User/user"));

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
