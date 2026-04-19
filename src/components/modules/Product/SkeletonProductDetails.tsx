const SkeletonProductDetails = () => {
  return (
    <section className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-border bg-background/50">
          <div className="h-105 w-full animate-pulse bg-muted" />
          <div className="grid grid-cols-4 gap-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
          <div className="h-12 w-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </section>
  );
};

export default SkeletonProductDetails;
