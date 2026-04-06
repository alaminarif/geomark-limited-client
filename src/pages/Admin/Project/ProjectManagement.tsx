import { useState } from "react";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import ProjectFilter from "@/components/modules/Project/ProjectFilter";
import ProjectCard from "@/components/modules/Project/ProjectCard";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteProjectMutation, useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { BriefcaseBusiness, CalendarRange, Eye, FolderKanban, LayoutGrid, MoreHorizontalIcon, Pencil, Rows3, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import AddProjectModal from "@/components/modules/Admin/Project/AddProjectModal";
import { SkeletonProjectManagement } from "@/components/modules/Admin/Project/SkeletonProjectManagement";

type ViewMode = "card" | "table";

type Project = {
  _id: string;
  name: string;
  year: string;
  status: string;
  service: { name: string };
  client: { name: string };
  picture?: string;
};

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const shellVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const switchContainerVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardContainerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.06,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const tableContainerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const cellVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(4px)",
  },

  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay,
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const dropdownItemVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay,
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  }),
};

const getStatusTone = (status?: string) => {
  const value = status?.toLowerCase() || "";

  if (value.includes("complete") || value.includes("done") || value.includes("finish")) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (value.includes("ongoing") || value.includes("active") || value.includes("running")) {
    return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
  }

  if (value.includes("pending") || value.includes("hold") || value.includes("draft")) {
    return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }

  return "border-primary/20 bg-primary/10 text-primary";
};

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const service = searchParams.get("service") || undefined;
  const year = searchParams.get("year") || undefined;
  const status = searchParams.get("status") || undefined;

  const { data: projects, isLoading } = useGetAllProjectsQuery({
    service,
    year,
    status,
    page: currentPage,
    limit: undefined,
    sort: "-year",
  });

  const [deleteProject] = useDeleteProjectMutation();

  const totalPage = projects?.meta?.totalPage || 1;

  const handleProjectDetails = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    const toastId = toast.loading("Deleting project...");

    try {
      const res = await deleteProject(projectId).unwrap();

      if (res.success) {
        toast.success("Project deleted successfully", { id: toastId });

        if (selectedProjectId === projectId) {
          setSelectedProjectId(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete project", { id: toastId });
      console.log(error);
    }
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("service");
    params.delete("year");
    params.delete("status");
    setSearchParams(params);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <SkeletonProjectManagement />;
  }

  return (
    <section className="container mx-auto overflow-x-hidden">
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="px-4 md:px-6 lg:px-8 xl:px-10">
        <motion.div variants={headerVariants} className="my-6">
          <motion.div variants={headerVariants} className="flex items-center justify-between my-6">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <h1 className="text-2xl font-bold tracking-tight">Project</h1>
              {/* <p className="mt-1 text-sm text-muted-foreground">Manage clients with a cleaner premium dashboard feel</p> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AddProjectModal />
            </motion.div>
          </motion.div>

          <motion.div
            variants={shellVariants}
            initial="hidden"
            animate="visible"
            className="rounded-3xl border border-border/50 bg-background/70 p-4 backdrop-blur-xl shadow-[0_16px_60px_-20px_rgba(0,0,0,0.35)]"
          >
            <ProjectFilter />

            <motion.div
              variants={switchContainerVariants}
              initial="hidden"
              animate="visible"
              className="mt-5 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="inline-flex rounded-2xl border border-border/50 bg-background/70 p-1 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    viewMode === "table" ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {viewMode === "table" && (
                    <motion.span
                      layoutId="project-view-toggle"
                      className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 to-blue-500"
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    />
                  )}
                  <Rows3 className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">Table View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("card")}
                  className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    viewMode === "card" ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {viewMode === "card" && (
                    <motion.span
                      layoutId="project-view-toggle"
                      className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 to-blue-500"
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    />
                  )}
                  <LayoutGrid className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">Card View</span>
                </button>
              </div>

              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                  onClick={handleClearFilter}
                >
                  Clear Filter
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === "card" && (
            <motion.div
              key={`card-${currentPage}-${service ?? ""}-${status ?? ""}-${year ?? ""}`}
              variants={cardContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-6 grid gap-3  grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 xl:gap-6"
            >
              {projects?.data?.map((item: Project) => (
                <motion.div
                  key={item._id}
                  variants={cardItemVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.015,
                    transition: { duration: 0.18 },
                  }}
                  whileTap={{ scale: 0.985 }}
                  className="will-change-transform"
                >
                  <ProjectCard item={item} onView={handleProjectDetails} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {viewMode === "table" && (
            <motion.div
              key={`table-${currentPage}-${service ?? ""}-${status ?? ""}-${year ?? ""}`}
              variants={tableContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative mt-6 rounded-3xl border border-border/50 bg-background/70 p-3 backdrop-blur-xl shadow-[0_16px_60px_-20px_rgba(0,0,0,0.35)]"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

              <div className="w-full overflow-x-auto ">
                <Table className="border-separate [border-spacing:0_10px]">
                  <TableHeader>
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</TableHead>
                      <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project Name</TableHead>
                      <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Year</TableHead>
                      <TableHead className="px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                      <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sector</TableHead>
                      <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Client</TableHead>
                      <TableHead className="px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {projects?.data?.map((item: Project, index: number) => {
                      const baseDelay = 0.08 + index * 0.05;
                      const isSelected = selectedProjectId === item._id;
                      const toneClass = isSelected ? "border-primary/35 bg-primary/[0.06]" : "border-border/50 bg-background/80";

                      return (
                        <TableRow
                          key={item._id}
                          onClick={() => setSelectedProjectId(item._id)}
                          className="group cursor-pointer border-none hover:bg-transparent"
                        >
                          <TableCell
                            className={`relative rounded-l-2xl border-y border-l px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="selected-project-row-indicator"
                                className="absolute left-1 top-1/2 h-12 w-1 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_20px_rgba(59,130,246,0.45)]"
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                              />
                            )}

                            <motion.div custom={baseDelay} variants={cellVariants} initial="hidden" animate="visible" className="relative w-fit">
                              <motion.div
                                className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl"
                                initial={{ opacity: 0, scale: 0.85 }}
                                whileHover={{ opacity: 1, scale: 1.18 }}
                                animate={isSelected ? { opacity: 1, scale: 1.08 } : { opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.28 }}
                              />

                              <motion.img
                                src={item.picture || "https://placehold.co/96x80/png"}
                                alt={item.name}
                                className="relative h-20 w-24 min-h-20 min-w-24 shrink-0 rounded-xl border border-border/50 object-cover shadow-md"
                                whileHover={{
                                  y: -2,
                                  scale: 1.05,
                                  rotate: 0.5,
                                }}
                                animate={isSelected ? { scale: 1.03, y: -1 } : { scale: 1, y: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 260,
                                  damping: 18,
                                }}
                              />
                            </motion.div>
                          </TableCell>

                          <TableCell className={`border-y px-2 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                            <motion.div
                              custom={baseDelay + 0.03}
                              variants={cellVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex items-center gap-2"
                            >
                              <div className="min-w-40">
                                <motion.div
                                  className="wrap-break-word line-clamp-3 font-medium whitespace-normal"
                                  whileHover={{ x: 3 }}
                                  animate={isSelected ? { x: 2 } : { x: 0 }}
                                  transition={{ type: "spring", stiffness: 260 }}
                                >
                                  {item.name}
                                </motion.div>

                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.span
                                      initial={{ opacity: 0, scale: 0.85, y: 6 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.85, y: 6 }}
                                      transition={{ duration: 0.18 }}
                                      className="mt-1 inline-flex rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary"
                                    >
                                      Selected
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          </TableCell>

                          <TableCell className={`border-y  py-3 align-middle transition-all duration-300 ${toneClass}`}>
                            <motion.div
                              custom={baseDelay + 0.06}
                              variants={cellVariants}
                              initial="hidden"
                              animate="visible"
                              className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary"
                            >
                              <CalendarRange className="h-3.5 w-3.5" />
                              <span>{item.year || "-"}</span>
                            </motion.div>
                          </TableCell>

                          <TableCell className={`border-y  py-3 text-center align-middle transition-all duration-300 ${toneClass}`}>
                            <motion.div custom={baseDelay + 0.09} variants={cellVariants} initial="hidden" animate="visible">
                              <span className={`inline-flex px-2 rounded-full border  py-1 text-xs font-semibold ${getStatusTone(item.status)}`}>
                                {item.status || "-"}
                              </span>
                            </motion.div>
                          </TableCell>

                          <TableCell className={`border-y  py-3 align-middle transition-all duration-300 ${toneClass}`}>
                            <motion.div custom={baseDelay + 0.12} variants={cellVariants} initial="hidden" animate="visible" className="">
                              <div className="inline-flex  items-center gap-2 py-1.5 text-xs font-semibold text-primary">
                                <FolderKanban className="h-3.5 " />
                                <span className="wrap-break-word line-clamp-3 whitespace-normal">{item?.service?.name || "-"}</span>
                              </div>
                            </motion.div>
                          </TableCell>

                          <TableCell className={`border-y py-3 align-middle transition-all duration-300 ${toneClass}`}>
                            <motion.div custom={baseDelay + 0.15} variants={cellVariants} initial="hidden" animate="visible" className="">
                              <div className="inline-flex items-center line-clamp-3 gap-2 text-xs text-foreground/90">
                                <BriefcaseBusiness className="h-3.5  text-primary" />
                                <span className="wrap-break-word  whitespace-normal">{item?.client?.name || "-"}</span>
                              </div>
                            </motion.div>
                          </TableCell>

                          <TableCell
                            className={`rounded-r-2xl border-y border-r  py-3 text-right align-middle transition-all duration-300 ${toneClass}`}
                          >
                            <motion.div
                              custom={baseDelay + 0.18}
                              variants={cellVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex justify-end"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`group/btn size-9 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                                      isSelected
                                        ? "border-primary/30 bg-primary/10 shadow-[0_8px_24px_-8px_rgba(59,130,246,0.35)]"
                                        : "border-transparent bg-background/70 hover:border-primary/20 hover:bg-primary/10 hover:shadow-[0_8px_24px_-8px_rgba(59,130,246,0.35)]"
                                    }`}
                                  >
                                    <motion.div
                                      whileHover={{ rotate: 90, scale: 1.08 }}
                                      whileTap={{ scale: 0.92 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 18,
                                      }}
                                      className="flex items-center justify-center"
                                    >
                                      <MoreHorizontalIcon className="h-4 w-4 transition-colors duration-300 group-hover/btn:text-primary" />
                                    </motion.div>
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                  align="end"
                                  sideOffset={10}
                                  onClick={(e) => e.stopPropagation()}
                                  className="
                                    w-48 overflow-hidden rounded-2xl border border-white/10
                                    bg-background/95 p-2 shadow-2xl backdrop-blur-xl
                                    data-[state=open]:animate-in
                                    data-[state=closed]:animate-out
                                    data-[state=open]:fade-in-0
                                    data-[state=closed]:fade-out-0
                                    data-[state=open]:zoom-in-95
                                    data-[state=closed]:zoom-out-95
                                    data-[side=bottom]:slide-in-from-top-2
                                    data-[side=top]:slide-in-from-bottom-2
                                    duration-200
                                  "
                                >
                                  <motion.div initial="hidden" animate="visible" className="space-y-1">
                                    <motion.div custom={0.02} variants={dropdownItemVariants}>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleProjectDetails(item._id);
                                        }}
                                        className="group/item cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary/10 focus:bg-primary/10"
                                      >
                                        <Eye className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/item:scale-110" />
                                        <span className="font-medium">View</span>
                                      </DropdownMenuItem>
                                    </motion.div>

                                    <motion.div custom={0.05} variants={dropdownItemVariants}>
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(`/admin/project/${item._id}/edit`);
                                        }}
                                        className="group/item cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary/10 focus:bg-primary/10"
                                      >
                                        <Pencil className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/item:scale-110" />
                                        <span className="font-medium">Edit</span>
                                      </DropdownMenuItem>
                                    </motion.div>

                                    <DropdownMenuSeparator className="my-1 opacity-50" />

                                    <motion.div custom={0.08} variants={dropdownItemVariants}>
                                      <DeleteConfirmation onConfirm={() => handleDeleteProject(item._id)}>
                                        <DropdownMenuItem
                                          onSelect={(e) => e.preventDefault()}
                                          onClick={(e) => e.stopPropagation()}
                                          className="group/item cursor-pointer rounded-xl px-3 py-2.5 text-destructive transition-all duration-200 hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                                        >
                                          <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/item:scale-110" />
                                          <span className="font-medium">Delete</span>
                                        </DropdownMenuItem>
                                      </DeleteConfirmation>
                                    </motion.div>
                                  </motion.div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {totalPage > 1 && (
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
                          setCurrentPage((prev) => prev - 1);
                        }
                      }}
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
                        className="relative cursor-pointer overflow-hidden rounded-xl"
                      >
                        {currentPage === page && (
                          <motion.span
                            layoutId="activeProjectPageBubble"
                            className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 to-blue-500"
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
                      onClick={() => {
                        if (currentPage < totalPage) {
                          setCurrentPage((prev) => prev + 1);
                        }
                      }}
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

export default ProjectManagement;
