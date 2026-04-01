import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export type { ISendOtp, IVerifyOtp, ILogin } from "./auth.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
export interface ISidebarChildItem {
  title: string;
  url: string;
  component: ComponentType;
  icon?: LucideIcon;
  description?: string;
  badge?: string;
}

export interface ISidebarItem {
  title: string;
  items: ISidebarChildItem[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "USER";
