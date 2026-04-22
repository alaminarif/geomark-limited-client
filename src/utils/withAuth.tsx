import Loading from "@/components/layout/Loading";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRoles?: TRole | TRole[]) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (isLoading) {
      return <Loading />;
    }

    if (!data?.data?.email) {
      return <Navigate to="/login" replace />;
    }

    const userRole = data?.data?.role;
    const allowedRoles = requiredRoles ? (Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]) : [];

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component />;
  };
};
