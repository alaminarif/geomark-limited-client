import { motion } from "framer-motion";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type DashboardPaginationProps = {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  layoutId: string;
};

const outlinedPaginationButtonClass =
  "h-11 min-w-11 rounded-full border border-blue-400 bg-background/80 px-4 text-sm font-medium text-blue-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-background/80 hover:text-primary hover:shadow-md dark:border-blue-400/40 dark:bg-background/80 dark:text-foreground/80 dark:hover:border-primary dark:hover:bg-background/80 dark:hover:text-primary";

const activePaginationButtonClass =
  "h-11 min-w-11 rounded-full border border-primary/80 bg-primary px-4 text-sm font-medium text-primary-foreground shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:text-primary-foreground hover:shadow-[0_10px_24px_-12px_rgba(47,58,153,0.35)] dark:border-primary/70 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 dark:hover:text-primary-foreground";

const DashboardPagination = ({ currentPage, totalPage, onPageChange, layoutId }: DashboardPaginationProps) => {
  if (totalPage <= 1) {
    return null;
  }

  return (
    <motion.div
      className="mt-6 flex justify-end"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
    >
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <motion.div whileHover={{ x: -2, scale: 1.04 }} whileTap={{ scale: 0.95 }}>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1);
                  }
                }}
                className={cn(outlinedPaginationButtonClass, currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}
              />
            </motion.div>
          </PaginationItem>

          {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
            <PaginationItem key={page}>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className={cn("relative cursor-pointer overflow-hidden", currentPage === page ? activePaginationButtonClass : outlinedPaginationButtonClass)}
                >
                  {currentPage === page && (
                    <motion.span
                      layoutId={layoutId}
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    />
                  )}
                  <span className={`relative z-10 ${currentPage === page ? "text-primary-foreground" : ""}`}>{page}</span>
                </PaginationLink>
              </motion.div>
            </PaginationItem>
          ))}

          <PaginationItem>
            <motion.div whileHover={{ x: 2, scale: 1.04 }} whileTap={{ scale: 0.95 }}>
              <PaginationNext
                onClick={() => {
                  if (currentPage < totalPage) {
                    onPageChange(currentPage + 1);
                  }
                }}
                className={cn(outlinedPaginationButtonClass, currentPage === totalPage ? "pointer-events-none opacity-50" : "cursor-pointer")}
              />
            </motion.div>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
};

export default DashboardPagination;
