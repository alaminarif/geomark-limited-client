/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Loading from "@/components/layout/Loading";
import ProjectFilter from "@/components/modules/Project/ProjectFilter";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useNavigate, useSearchParams } from "react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProjectCard from "@/components/modules/Project/ProjectCard";
import { AnimatePresence, motion, type Variants } from "framer-motion";

type ViewMode = "card" | "table";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const ProjectPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(2);
  const [searchParams, setSearchParams] = useSearchParams();

  const title = searchParams.get("title") || undefined;
  const status = searchParams.get("status") || undefined;

  const { data: projects, isLoading } = useGetAllProjectsQuery({
    title,
    status,
    page: currentPage,
    limit,
  });

  const totalPage = projects?.meta?.totalPage || 1;

  if (isLoading) return <Loading />;

  const handleProjectDetails = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("title");
    params.delete("period");
    params.delete("status");
    setSearchParams(params);
    setCurrentPage(1);
  };

  return (
    <section className="container mx-auto">
      <motion.div
        className="px-4 md:px-6 lg:px-8 xl:px-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        <div className="mt-4">
          <ProjectFilter />

          <div className="flex justify-between mt-6 gap-3 flex-wrap">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                className="text-center rounded-md px-4 py-1 bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                onClick={() => setViewMode((prev) => (prev === "card" ? "table" : "card"))}
              >
                {viewMode === "card" ? "Table View" : "Card View"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button size="sm" variant="outline" className="text-destructive" onClick={handleClearFilter}>
                Clear Filter
              </Button>
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* CARD VIEW */}
          {viewMode === "card" && (
            <motion.div
              key={`card-${currentPage}-${title ?? ""}-${status ?? ""}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8"
            >
              {projects?.data?.map((item: any) => (
                <motion.div
                  key={item?._id}
                  variants={itemVariants}
                  layout
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.985 }}
                  className="will-change-transform"
                >
                  <ProjectCard item={item} onView={handleProjectDetails} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* TABLE VIEW */}
          {viewMode === "table" && (
            <motion.div
              key={`table-${currentPage}-${title ?? ""}-${status ?? ""}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-6 overflow-hidden rounded-3xl border border-muted shadow-sm"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-center font-bold">Image</TableHead>
                    <TableHead className="text-center font-bold">Project Name</TableHead>
                    <TableHead className="text-center font-bold">Period</TableHead>
                    <TableHead className="text-center font-bold">Status</TableHead>
                    <TableHead className="text-center font-bold">Sector</TableHead>
                    <TableHead className="text-center font-bold">Client</TableHead>
                    <TableHead className="text-right font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {projects?.data?.map((item: any, index: number) => (
                    <TableRow key={item?._id} className="group transition-all duration-300 hover:bg-muted/40">
                      <TableCell className="font-medium">
                        <motion.div
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.35 }}
                        >
                          <motion.img
                            src={item.picture}
                            alt={item.name}
                            className="w-25 h-20 rounded-xl object-cover"
                            whileHover={{ scale: 1.08, rotate: 0.5 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                          />
                        </motion.div>
                      </TableCell>

                      <TableCell className="font-medium">
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 + 0.03, duration: 0.35 }}
                          className="font-medium whitespace-normal wrap-break-word"
                        >
                          {item.name}
                        </motion.p>
                      </TableCell>

                      <TableCell>
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 + 0.05, duration: 0.35 }}
                        >
                          <span>{item?.year}</span>
                        </motion.p>
                      </TableCell>

                      <TableCell>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.06, duration: 0.3 }}
                        >
                          <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-muted">{item.status}</span>
                        </motion.div>
                      </TableCell>

                      <TableCell>
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 + 0.08, duration: 0.35 }}
                          className="whitespace-normal wrap-break-word"
                        >
                          {item.title}
                        </motion.p>
                      </TableCell>

                      <TableCell>
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 + 0.1, duration: 0.35 }}
                        >
                          {item?.client?.name}
                        </motion.p>
                      </TableCell>

                      <TableCell className="text-right">
                        <motion.div
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.12, duration: 0.35 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          className="inline-block"
                        >
                          <Button
                            onClick={() => handleProjectDetails(item?._id)}
                            className="rounded-md px-4 py-1 bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                          >
                            View
                          </Button>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
        </AnimatePresence>

        {totalPage > 1 && (
          <motion.div
            className="flex justify-end mt-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <motion.div whileHover={{ x: -2, scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </motion.div>
                </PaginationItem>

                {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                  <PaginationItem key={page}>
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="relative cursor-pointer overflow-hidden"
                      >
                        {currentPage === page && (
                          <motion.span
                            layoutId="activePageBubble"
                            className="absolute inset-0 rounded-md bg-linear-to-r from-purple-500 to-blue-500"
                            transition={{ type: "spring", stiffness: 320, damping: 24 }}
                          />
                        )}
                        <span className={`relative z-10 ${currentPage === page ? "text-white" : ""}`}>{page}</span>
                      </PaginationLink>
                    </motion.div>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <motion.div whileHover={{ x: 2, scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className={currentPage === totalPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </motion.div>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectPage;
