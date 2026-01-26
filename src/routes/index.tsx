import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  { Component: App, path: "/" },
  {
    Component: DashboardLayout,
    path: "/admin",
    children: [
      // Component:
    ],
  },
  {
    Component: DashboardLayout,
    path: "/user",
    children: [
      // Component:
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
]);
