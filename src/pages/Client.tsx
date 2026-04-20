import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import Loading from "@/components/layout/Loading";
import { useGetClientsQuery } from "@/redux/features/client/client.api";
import ClientCard from "@/components/modules/Client/ClientCard";

interface CommunityProps {
  className?: string;
}

interface ClientItem {
  _id?: string;
  name: string;
  picture: string;
  link?: string;
}

const getItemsPerPage = (width: number) => {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
};

const Client = ({ className }: CommunityProps) => {
  const { data, isLoading } = useGetClientsQuery(undefined);
  const items: ClientItem[] = data?.data || [];

  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== "undefined") {
      return getItemsPerPage(window.innerWidth);
    }
    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pages = useMemo(() => {
    if (!items.length) return [];

    const result: ClientItem[][] = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      result.push(items.slice(i, i + itemsPerPage));
    }

    return result;
  }, [items, itemsPerPage]);

  const totalPages = pages.length;
  const safeCurrentPage = totalPages > 0 ? currentPage % totalPages : 0;

  useEffect(() => {
    if (!isAutoPlay || totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlay, totalPages]);

  const handlePrev = () => {
    if (!totalPages) return;
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    if (!totalPages) return;
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  if (isLoading) return <Loading />;

  return (
    <section className={cn("relative overflow-hidden py-20 container mx-auto", className)}>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Trusted Network</p>

            <h2 className="text-2xl font-bold uppercase text-blue-800 dark:text-foreground sm:text-3xl md:text-4xl">Our Clients</h2>

            {/* <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              We are proud to work with respected organizations across planning, engineering, GIS and survey-based projects.
            </p> */}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600"
              >
                <ChevronLeft className="size-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsAutoPlay((prev) => !prev)}
                className="inline-flex h-11 min-w-27.5 items-center justify-center gap-2 rounded-full border border-border bg-background/80 px-4 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600"
              >
                {isAutoPlay ? <Pause className="size-4" /> : <Play className="size-4" />}
                {isAutoPlay ? "Pause" : "Play"}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </motion.div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeCurrentPage}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
            >
              {(pages[safeCurrentPage] || []).map((item, index) => (
                <ClientCard key={item._id || `${item.name}-${index}`} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentPage(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  safeCurrentPage === index ? "w-8 bg-blue-600 dark:bg-blue-400" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Client;
