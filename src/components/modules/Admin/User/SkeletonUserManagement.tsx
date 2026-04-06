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

export const SkeletonUserManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-7xl mx-auto px-5"
    >
      <div className="my-6 flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-32 rounded-lg" />
          <SkeletonBlock className="mt-2 h-4 w-64 rounded-lg" />
        </div>
        <SkeletonBlock className="h-10 w-28 rounded-xl" />
      </div>

      <div className="relative rounded-3xl border border-border/50 bg-background/70 p-3 backdrop-blur-xl shadow-[0_16px_60px_-20px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        <div className="w-full overflow-x-auto">
          <Table className=" border-separate [border-spacing:0_10px]">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-4">Image</TableHead>
                <TableHead className="px-4">Name</TableHead>
                <TableHead className="px-4">Email</TableHead>
                <TableHead className="px-4">Role</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index} className="border-none hover:bg-transparent">
                  <TableCell className="rounded-l-2xl border-y border-l border-border/50 bg-background/80 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <SkeletonBlock className="h-11 w-11 rounded-2xl" />
                      <div className="space-y-2">
                        <SkeletonBlock className="h-4 w-28" />
                        <SkeletonBlock className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                    <SkeletonBlock className="h-5 w-44" />
                  </TableCell>

                  <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                    <SkeletonBlock className="h-8 w-24 rounded-full" />
                  </TableCell>

                  <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                    <SkeletonBlock className="h-8 w-24 rounded-full" />
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
    </motion.div>
  );
};
