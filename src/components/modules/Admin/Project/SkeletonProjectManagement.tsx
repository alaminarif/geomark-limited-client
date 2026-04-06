import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { motion } from "framer-motion";

const SkeletonBlock = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative overflow-hidden rounded-md bg-muted/70 ${className}`}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.35, ease: "linear" }}
      />
    </div>
  );
};

export const SkeletonProjectManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="container mx-auto overflow-x-hidden"
    >
      <div className="px-4 ">
        <div className="my-6">
          <SkeletonBlock className="h-8  rounded-lg" />
          <SkeletonBlock className="mt-2 h-4  rounded-lg" />
        </div>

        <div className="rounded-3xl border border-border/50 bg-background/70 p-4 backdrop-blur-xl shadow-[0_16px_60px_-20px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <SkeletonBlock className="h-10 w-full rounded-xl" />
            <SkeletonBlock className="h-10 w-full rounded-xl" />
            <SkeletonBlock className="h-10 w-full rounded-xl" />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <SkeletonBlock className="h-10 rounded-xl" />
            <SkeletonBlock className="h-10 rounded-xl" />
          </div>
        </div>

        <div className="relative mt-6 rounded-3xl border border-border/50 bg-background/70 p-3 backdrop-blur-xl shadow-[0_16px_60px_-20px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

          <div className=" overflow-x-auto">
            <Table className=" border-separate [border-spacing:0_10px]">
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="px-4">Image</TableHead>
                  <TableHead className="px-4">Project Name</TableHead>
                  <TableHead className="px-4">Year</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4">Sector</TableHead>
                  <TableHead className="px-4">Client</TableHead>
                  <TableHead className="px-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index} className="border-none hover:bg-transparent">
                    <TableCell className="rounded-l-2xl border-y border-l border-border/50 bg-background/80 px-4 py-3">
                      <SkeletonBlock className="h-20 w-24 min-h-20 min-w-24 rounded-xl" />
                    </TableCell>

                    <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                      <SkeletonBlock className="h-5 " />
                    </TableCell>

                    <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                      <SkeletonBlock className="h-5 " />
                    </TableCell>

                    <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                      <SkeletonBlock className="h-8  rounded-full" />
                    </TableCell>

                    <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                      <SkeletonBlock className="h-5 " />
                    </TableCell>

                    <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                      <SkeletonBlock className="h-5" />
                    </TableCell>

                    <TableCell className="rounded-r-2xl border-y border-r border-border/50 bg-background/80 px-4 py-3 text-right">
                      <div className="flex justify-end">
                        <SkeletonBlock className="h-9 w-9 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
