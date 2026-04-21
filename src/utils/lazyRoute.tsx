/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layout/Loading";
import { lazy, Suspense, type ComponentType } from "react";

type RouteModule = {
  default?: ComponentType<any>;
  [key: string]: unknown;
};

export const lazyRoute = (importer: () => Promise<RouteModule>, exportName?: string): ComponentType<any> => {
  const LazyComponent = lazy(async () => {
    const module = await importer();
    const resolved = exportName ? module[exportName] : module.default;

    if (!resolved) {
      throw new Error(`Unable to resolve lazy route component${exportName ? `: ${exportName}` : ""}`);
    }

    return { default: resolved as ComponentType<any> };
  });

  const LazyRouteComponent: ComponentType<any> = function LazyRouteComponent(props: any) {
    return (
      <Suspense fallback={<Loading />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  return LazyRouteComponent;
};
