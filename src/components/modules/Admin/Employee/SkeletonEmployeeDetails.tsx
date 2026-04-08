const SkeletonBlock = ({ className = "" }: { className?: string }) => {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800 ${className}`} />;
};

export const SkeletonEmployeeDetails = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <SkeletonBlock className="h-11 w-28 rounded-2xl" />
          <SkeletonBlock className="h-11 w-36 rounded-2xl" />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
          <div className="h-48 bg-slate-300/70 dark:bg-slate-800 md:h-60" />

          <div className="relative px-5 pb-6 md:px-8 md:pb-8">
            <div className="-mt-16 rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 md:-mt-20 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <SkeletonBlock className="h-28 w-28 rounded-[24px] md:h-32 md:w-32" />

                  <div className="space-y-3">
                    <SkeletonBlock className="h-8 w-56" />
                    <SkeletonBlock className="h-5 w-40 rounded-full" />
                    <SkeletonBlock className="h-4 w-72" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-70">
                  <SkeletonBlock className="h-24 w-full" />
                  <SkeletonBlock className="h-24 w-full" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-5">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <SkeletonBlock className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <SkeletonBlock className="h-5 w-44" />
                      <SkeletonBlock className="h-4 w-56" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <SkeletonBlock className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <SkeletonBlock className="h-5 w-44" />
                      <SkeletonBlock className="h-4 w-56" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                    <SkeletonBlock className="h-24 w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <SkeletonBlock className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <SkeletonBlock className="h-5 w-32" />
                      <SkeletonBlock className="h-4 w-44" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                    <SkeletonBlock className="h-20 w-full" />
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <SkeletonBlock className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <SkeletonBlock className="h-5 w-36" />
                      <SkeletonBlock className="h-4 w-48" />
                    </div>
                  </div>

                  <SkeletonBlock className="h-20 w-full" />
                  <SkeletonBlock className="mt-4 h-28 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
