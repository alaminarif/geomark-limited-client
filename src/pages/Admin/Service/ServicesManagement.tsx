import { useState } from "react";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { AddServiceModal } from "@/components/modules/Admin/Service/AddServiceModal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteServiceMutation, useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { Eye, MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AnimatePresence, motion, type Variants } from "framer-motion";

type Service = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
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

const SkeletonServicesTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-7xl mx-auto px-5"
    >
      <div className="my-6 flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-36 rounded-lg" />
          <SkeletonBlock className="mt-2 h-4 w-72 rounded-lg" />
        </div>
        <SkeletonBlock className="h-10 w-36 rounded-xl" />
      </div>

      <div className="relative rounded-3xl border border-border/50 bg-background/70 p-3 backdrop-blur-xl shadow-[0_16px_60px_-20px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        <div className="w-full overflow-x-auto">
          <Table className="min-w-262.5 border-separate [border-spacing:0_10px]">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-4">Image</TableHead>
                <TableHead className="px-4">Name</TableHead>
                <TableHead className="px-4">Description</TableHead>
                <TableHead className="px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index} className="border-none hover:bg-transparent">
                  <TableCell className="rounded-l-2xl border-y border-l border-border/50 bg-background/80 px-4 py-3">
                    <SkeletonBlock className="h-20 w-24 min-h-20 min-w-24 rounded-xl" />
                  </TableCell>

                  <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-4 w-36" />
                      <SkeletonBlock className="h-4 w-28" />
                    </div>
                  </TableCell>

                  <TableCell className="border-y border-border/50 bg-background/80 px-4 py-3">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-4 w-[90%]" />
                      <SkeletonBlock className="h-4 w-[85%]" />
                      <SkeletonBlock className="h-4 w-[70%]" />
                    </div>
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

const ServicesManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllServicesQuery(undefined);
  const [deleteService] = useDeleteServiceMutation();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const handleDeleteService = async (serviceId: string) => {
    const toastId = toast.loading("Deleting service...");

    try {
      const res = await deleteService(serviceId).unwrap();

      if (res.success) {
        toast.success("Service deleted successfully", { id: toastId });

        if (selectedServiceId === serviceId) {
          setSelectedServiceId(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete service", { id: toastId });
      console.log(error);
    }
  };

  const handleServiceDetails = (id: string) => {
    navigate(`/admin/service/${id}`);
  };
  const handleServiceEdit = (id: string) => {
    navigate(`/admin/service/${id}/edit`);
  };

  if (isLoading) {
    return <SkeletonServicesTable />;
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto px-5">
      <motion.div variants={headerVariants} className="my-6 flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage services with a cleaner premium dashboard feel</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AddServiceModal />
        </motion.div>
      </motion.div>

      <motion.div
        variants={shellVariants}
        initial="hidden"
        animate="visible"
        className="relative rounded-3xl border border-border/50 bg-background/70 p-3 backdrop-blur-xl shadow-[0_16px_60px_-20px_rgba(0,0,0,0.35)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        <div className="w-full overflow-x-auto">
          <Table className="border-separate [border-spacing:0_10px]">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</TableHead>
                <TableHead className="px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.data?.map((item: Service, index: number) => {
                const baseDelay = 0.08 + index * 0.05;
                const isSelected = selectedServiceId === item._id;
                const toneClass = isSelected ? "border-primary/35 bg-primary/[0.06]" : "border-border/50 bg-background/80";

                const imageSrc = item.image || item.picture || "https://placehold.co/96x80/png";

                return (
                  <TableRow
                    key={item._id}
                    onClick={() => setSelectedServiceId(item._id)}
                    className="group cursor-pointer border-none hover:bg-transparent"
                  >
                    <TableCell className={`relative rounded-l-2xl border-y border-l px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                      {isSelected && (
                        <motion.div
                          layoutId="selected-service-row-indicator"
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
                          src={imageSrc}
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

                    <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                      <motion.div custom={baseDelay + 0.03} variants={cellVariants} initial="hidden" animate="visible" className="min-w-0 max-w-65">
                        <motion.p
                          className="line-clamp-3 wrap-break-word text-sm font-medium leading-6 whitespace-normal"
                          whileHover={{ x: 3 }}
                          animate={isSelected ? { x: 2 } : { x: 0 }}
                          transition={{ type: "spring", stiffness: 260 }}
                        >
                          {item.name}
                        </motion.p>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.85, y: 6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.85, y: 6 }}
                              transition={{ duration: 0.18 }}
                              className="mt-2 inline-flex rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary"
                            >
                              Selected
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </TableCell>

                    <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                      <motion.div custom={baseDelay + 0.06} variants={cellVariants} initial="hidden" animate="visible" className="max-w-120">
                        <motion.p
                          className="line-clamp-3 wrap-break-word text-sm leading-6 text-foreground/90 whitespace-normal"
                          whileHover={{ x: 2 }}
                          animate={isSelected ? { x: 1 } : { x: 0 }}
                          transition={{ type: "spring", stiffness: 240 }}
                        >
                          {item.description || "-"}
                        </motion.p>
                      </motion.div>
                    </TableCell>

                    <TableCell
                      className={`rounded-r-2xl border-y border-r px-4 py-3 text-right align-middle transition-all duration-300 ${toneClass}`}
                    >
                      <motion.div
                        custom={baseDelay + 0.09}
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
                                    handleServiceDetails(item._id);
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
                                    handleServiceEdit(item._id);
                                  }}
                                  className="group/item cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary/10 focus:bg-primary/10"
                                >
                                  <Pencil className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/item:scale-110" />
                                  <span className="font-medium">Edit</span>
                                </DropdownMenuItem>
                              </motion.div>

                              <DropdownMenuSeparator className="my-1 opacity-50" />

                              <motion.div custom={0.08} variants={dropdownItemVariants}>
                                <DeleteConfirmation onConfirm={() => handleDeleteService(item._id)}>
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
    </motion.div>
  );
};

export default ServicesManagement;
