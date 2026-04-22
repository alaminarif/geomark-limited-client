import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "18rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset className="min-w-0 bg-transparent">
        <header className="flex min-w-0 h-16 shrink-0 items-center gap-2 border-b px-4 bg-transparent">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        </header>

        <div className="flex min-w-0 flex-1 flex-col gap-4 bg-transparent p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
