import type { ISidebarItem } from "@/types";
import { lazyRoute } from "@/utils/lazyRoute";
import { ShieldEllipsis, UserRound } from "lucide-react";

const User = lazyRoute(() => import("@/pages/User/user"));
const ChangePassword = lazyRoute(() => import("@/pages/Authenticantion/ChangePassword"));

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/user/users",
        component: User,
        icon: UserRound,
        description: "Quick access to your dashboard home",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Change Password",
        url: "/user/change-password",
        component: ChangePassword,
        icon: ShieldEllipsis,
        description: "Update your account password",
      },
    ],
  },
];
