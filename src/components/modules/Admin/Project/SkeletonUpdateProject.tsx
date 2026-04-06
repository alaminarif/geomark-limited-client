const SkeletonBox = ({ className = "" }: { className?: string }) => {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`} />;
};
export const SkeletonUpdateProject = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-purple-50 via-white to-blue-50 px-4 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:px-6">
      <div className="mx-auto max-w-7xl min-w-0 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <SkeletonBox className="h-10 w-28 rounded-xl" /> <SkeletonBox className="h-20 w-[320px] rounded-3xl md:w-105" />
          </div>
          <SkeletonBox className="h-12 w-40 rounded-3xl" />
        </div>
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
              <SkeletonBox className="h-11 w-11" />
              <div className="space-y-2">
                <SkeletonBox className="h-5 w-44" /> <SkeletonBox className="h-4 w-72" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SkeletonBox className="h-12 w-full rounded-xl" /> <SkeletonBox className="h-12 w-full rounded-xl" />
              <SkeletonBox className="h-12 w-full rounded-xl md:col-span-2" /> <SkeletonBox className="h-28 w-full rounded-xl md:col-span-2" />
              <SkeletonBox className="h-28 w-full rounded-xl" /> <SkeletonBox className="h-28 w-full rounded-xl" />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
              <SkeletonBox className="h-11 w-11" />
              <div className="space-y-2">
                <SkeletonBox className="h-5 w-40" /> <SkeletonBox className="h-4 w-60" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SkeletonBox className="h-12 w-full rounded-xl" /> <SkeletonBox className="h-12 w-full rounded-xl" />
              <SkeletonBox className="h-12 w-full rounded-xl" /> <SkeletonBox className="h-12 w-full rounded-xl" />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center gap-3">
              <SkeletonBox className="h-11 w-11" />
              <div className="space-y-2">
                <SkeletonBox className="h-5 w-40" /> <SkeletonBox className="h-4 w-80" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SkeletonBox className="h-56 w-full rounded-2xl" /> <SkeletonBox className="h-56 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
