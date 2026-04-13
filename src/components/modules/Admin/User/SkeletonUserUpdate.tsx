export const SkeletonUserUpdate = () => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-52 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded-xl bg-muted" />
      </div>

      <div className="rounded-3xl border bg-background p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-52 w-full animate-pulse rounded-2xl bg-muted" />
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-11 w-28 animate-pulse rounded-xl bg-muted" />
              <div className="h-11 w-36 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
