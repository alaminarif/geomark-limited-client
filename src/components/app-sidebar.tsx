import * as React from "react";

import logo from "@/assets/images/Geomark_Logo_png.png";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { authApi, useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { getSidebarItems } from "@/utils/getSidebarItems";
import { ChevronRight, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { data: userData } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await logout(undefined);
    dispatch(authApi.util.resetApiState());
  };

  const navMain = getSidebarItems(userData?.data?.role);

  return (
    <Sidebar
      {...props}
      className="border-r border-slate-200 bg-white/95 text-slate-800 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
    >
      <SidebarHeader className="border-b border-slate-200 bg-white/90 px-3 py-4 dark:border-slate-800 dark:bg-slate-950">
        <Link
          to="/"
          className="group block rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700 dark:hover:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
              <img src={logo} alt="Geomark Logo" className="h-8 w-auto" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-slate-900 dark:text-white">Geomark Limited</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin control panel</p>
            </div>
          </div>
        </Link>

        <div className="mt-3">{/* <SearchForm /> */}</div>
      </SidebarHeader>

      <SidebarContent className="bg-white/90 px-2 py-3 dark:bg-slate-950">
        {navMain.map((group) => (
          <SidebarGroup key={group.title} className="py-1">
            <SidebarGroupLabel className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
              {group.title}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);

                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "h-auto rounded-2xl border p-0 transition-all duration-300 hover:bg-transparent data-[active=true]:bg-transparent",
                          isActive
                            ? "border-indigo-200 bg-linear-to-r from-indigo-50 via-violet-50 to-sky-50 shadow-sm dark:border-indigo-500/30 dark:bg-linear-to-r dark:from-indigo-500/15 dark:via-purple-500/10 dark:to-sky-500/10 dark:shadow-[0_8px_30px_rgba(79,70,229,0.18)]"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700 dark:hover:bg-slate-900",
                        )}
                      >
                        <Link to={item.url} className="block w-full">
                          <div className="flex items-center gap-3 p-3">
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                                isActive
                                  ? "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-300"
                                  : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400",
                              )}
                            >
                              {Icon ? <Icon className="h-5 w-5" /> : <ChevronRight className="h-4 w-4" />}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={cn(
                                    "truncate text-sm font-medium",
                                    isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200",
                                  )}
                                >
                                  {item.title}
                                </span>

                                <ChevronRight
                                  className={cn(
                                    "h-4 w-4 shrink-0 transition-all duration-300",
                                    isActive ? "text-indigo-500 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500",
                                  )}
                                />
                              </div>

                              {"description" in item && item.description ? (
                                <p
                                  className={cn(
                                    "mt-1 line-clamp-2 text-xs leading-5",
                                    isActive ? "text-slate-600 dark:text-slate-300" : "text-slate-500 dark:text-slate-500",
                                  )}
                                >
                                  {item.description}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <div className="border-t border-slate-200 bg-white/90 p-3 dark:border-slate-800 dark:bg-slate-950">
        {/* <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-600 dark:border-slate-800 dark:bg-slate-950 dark:text-sky-300">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Premium dashboard</p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-500">Clean navigation with better light and dark hierarchy.</p>
            </div>
          </div>
        </div> */}

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full rounded-xl border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
