import { useLocation } from "react-router";

import SEO from "@/components/SEO";
import { publicRouteSeo } from "@/lib/seo";

const normalizePathname = (pathname: string) => {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
};

const RouteSEO = () => {
  const { pathname } = useLocation();
  const seo = publicRouteSeo[normalizePathname(pathname)];

  if (!seo) return null;

  return <SEO {...seo} />;
};

export default RouteSEO;
