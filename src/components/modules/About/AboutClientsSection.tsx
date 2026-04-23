import { useEffect, useMemo, useState } from "react";

import ClientCard from "@/components/modules/Client/ClientCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type AboutClient = {
  _id?: string;
  name: string;
  picture: string;
  link?: string;
};

type AboutClientsSectionProps = {
  clients: AboutClient[];
};

const getClientItemsPerPage = (width: number) => {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
};

const chunkItems = <T,>(items: T[], size: number) => {
  if (!items.length || size <= 0) return [];

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

export default function AboutClientsSection({ clients }: AboutClientsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== "undefined") {
      return getClientItemsPerPage(window.innerWidth);
    }

    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getClientItemsPerPage(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const clientPages = useMemo(() => chunkItems(clients, itemsPerPage), [clients, itemsPerPage]);
  const totalPages = clientPages.length;
  const safeCurrentPage = totalPages > 0 ? currentPage % totalPages : 0;
  const visibleClients = clientPages[safeCurrentPage] || [];
  const showControls = totalPages > 1;

  if (!totalPages) return null;

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <section className="mt-8">
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Trusted Network</p>
        <h2 className="text-2xl font-bold uppercase text-blue-800 dark:text-foreground sm:text-3xl md:text-4xl">Our Clients</h2>
      </div>

      <div className="relative">
        {showControls && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-blue-400 bg-background/85 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-600 hover:text-white dark:text-white"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        <div className="overflow-hidden px-0 sm:px-14">
          <motion.div
            key={safeCurrentPage}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
          >
            {visibleClients.map((item, index) => (
              <ClientCard key={item._id || `${item.name}-${index}`} item={item} />
            ))}
          </motion.div>
        </div>

        {showControls && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-blue-400 bg-background/85 text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-600 hover:text-white dark:text-white"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>

      {showControls && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {clientPages.map((_, index) => (
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
    </section>
  );
}
