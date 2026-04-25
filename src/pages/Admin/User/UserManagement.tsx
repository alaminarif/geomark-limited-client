import { useState } from "react";
import { Button } from "@/components/ui/button";
import DashboardPagination from "@/components/ui/dashboard-pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeCheck, Eye, MoreHorizontalIcon, Pencil, ShieldCheck, UserRound, UserRoundPlus, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetAllUsersQuery } from "@/redux/features/user/user.api";
import { motion, type Variants } from "framer-motion";
import { SkeletonUserManagement } from "@/components/modules/Admin/User/SkeletonUserManagement";

type User = {
  _id: string;
  picture: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean | string;
};

const PAGE_SIZE = 10;

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

const getRoleTone = (role?: string) => {
  const value = role?.trim().toUpperCase() || "";

  switch (value) {
    case "SUPER_ADMIN":
      return "border-violet-500/25 bg-violet-500/12 text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-300";
    case "ADMIN":
      return "border-sky-500/25 bg-sky-500/12 text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/15 dark:text-sky-300";
    case "USER":
      return "border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300";
    case "MANAGER":
      return "border-amber-500/25 bg-amber-500/12 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-300";
    default:
      if (value.includes("SUPER")) {
        return "border-fuchsia-500/25 bg-fuchsia-500/12 text-fuchsia-700 dark:border-fuchsia-400/30 dark:bg-fuchsia-500/15 dark:text-fuchsia-300";
      }

      if (value.includes("ADMIN")) {
        return "border-indigo-500/25 bg-indigo-500/12 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-300";
      }

      return "border-slate-400/25 bg-slate-500/10 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300";
  }
};

const getActiveTone = (value?: boolean | string) => {
  const active = value === true || value === "true" || value === "active" || value === "ACTIVE" || value === "Active";

  return active
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400";
};

const getActiveLabel = (value?: boolean | string) => {
  const active = value === true || value === "true" || value === "active" || value === "ACTIVE" || value === "Active";

  return active ? "Active" : "Inactive";
};

const UserManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    limit: PAGE_SIZE,
  });
  // const [deleteUser] = useDeleteUserMutation();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const rawUsers: User[] = data?.data || [];
  const hasServerPagination = typeof data?.meta?.totalPage === "number";
  const totalPage = hasServerPagination ? data.meta.totalPage : Math.max(1, Math.ceil(rawUsers.length / PAGE_SIZE));
  const users = hasServerPagination ? rawUsers : rawUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // const handleDeleteUser = async (userId: string) => {
  //   const toastId = toast.loading("Deleting user...");

  //   try {
  //     const res = await deleteUser(userId).unwrap();

  //     if (res.success) {
  //       toast.success("User deleted successfully", { id: toastId });

  //       if (selectedUserId === userId) {
  //         setSelectedUserId(null);
  //       }
  //     }
  //   } catch (error) {
  //     toast.error("Failed to delete user", { id: toastId });
  //     console.log(error);
  //   }
  // };

  const handleRegisterUser = () => {
    navigate("/register");
  };

  const handleUserDetails = (id: string) => {
    navigate(`/admin/user/${id}`);
  };

  const handleUserUpdate = (id: string) => {
    navigate(`/admin/user/${id}/edit`);
  };

  if (isLoading) {
    return <SkeletonUserManagement />;
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto px-5">
      <motion.div variants={headerVariants} className="my-6 flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="text-2xl font-bold tracking-tight">User</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage users with a cleaner premium dashboard feel</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleRegisterUser}
            className="rounded-xl bg-linear-to-r from-purple-500 to-blue-500 shadow-lg transition-all duration-300 hover:shadow-purple-500/30"
          >
            <UserRoundPlus className=" h-4 w-4" />
            Add User
          </Button>
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
          <Table className="min-w-180 2xl:min-w-250 mx-auto border-separate [border-spacing:0_10px]">
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</TableHead>
                <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((item: User, index: number) => {
                const baseDelay = 0.08 + index * 0.05;
                const isSelected = selectedUserId === item._id;
                const toneClass = isSelected ? "border-primary/35 bg-primary/[0.06]" : "border-border/50 bg-background/80";

                return (
                  <TableRow
                    key={item._id}
                    onClick={() => setSelectedUserId(item._id)}
                    className="group cursor-pointer border-none hover:bg-transparent"
                  >
                    <TableCell className={`relative rounded-l-2xl border-y border-l px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                      {isSelected && (
                        <motion.div
                          layoutId="selected-user-row-indicator"
                          className="absolute left-1 top-1/2 h-12 w-1 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_20px_rgba(59,130,246,0.45)]"
                          transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        />
                      )}

                      <motion.div custom={baseDelay} variants={cellVariants} initial="hidden" animate="visible" className="flex items-center gap-3">
                        <motion.div
                          className="relative flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-background shadow-sm"
                          whileHover={{ y: -2, scale: 1.04 }}
                          animate={
                            isSelected
                              ? {
                                  scale: 1.03,
                                  boxShadow: "0 8px 24px -8px rgba(59,130,246,0.35)",
                                }
                              : { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }
                          }
                          transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        >
                          <motion.div
                            className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl"
                            initial={{ opacity: 0, scale: 0.85 }}
                            whileHover={{ opacity: 1, scale: 1.18 }}
                            animate={isSelected ? { opacity: 1, scale: 1.08 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.28 }}
                          />

                          {item.picture ? (
                            <motion.img
                              src={item.picture}
                              alt={item.name || "User"}
                              className="relative h-full w-full object-cover"
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            />
                          ) : (
                            <UserRound className="relative h-8 w-8 text-primary" />
                          )}
                        </motion.div>
                      </motion.div>
                    </TableCell>

                    <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                      <motion.div
                        custom={baseDelay + 0.03}
                        variants={cellVariants}
                        initial="hidden"
                        animate="visible"
                        className="min-w-0 max-w-60 wrap-break-word whitespace-normal line-clamp-3 font-medium text-sm text-foreground/90"
                      >
                        {item.name || "-"}
                      </motion.div>
                    </TableCell>

                    <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                      <motion.div
                        custom={baseDelay + 0.03}
                        variants={cellVariants}
                        initial="hidden"
                        animate="visible"
                        className="font-medium text-sm text-foreground/90"
                      >
                        {item.email || "-"}
                      </motion.div>
                    </TableCell>

                    <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                      <motion.div custom={baseDelay + 0.06} variants={cellVariants} initial="hidden" animate="visible">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getRoleTone(item.role)}`}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>{item.role || "-"}</span>
                        </span>
                      </motion.div>
                    </TableCell>

                    <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                      <motion.div custom={baseDelay + 0.09} variants={cellVariants} initial="hidden" animate="visible">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getActiveTone(
                            item.isActive,
                          )}`}
                        >
                          {getActiveLabel(item.isActive) === "Active" ? <BadgeCheck className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          <span>{getActiveLabel(item.isActive)}</span>
                        </span>
                      </motion.div>
                    </TableCell>

                    <TableCell
                      className={`rounded-r-2xl border-y border-r px-4 py-3 text-right align-middle transition-all duration-300 ${toneClass}`}
                    >
                      <motion.div
                        custom={baseDelay + 0.12}
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
                                  ? "border-primary/30 bg-primary/10 text-primary shadow-[0_8px_24px_-8px_rgba(47,58,153,0.2)]"
                                  : "border-transparent bg-background/70 text-slate-500 hover:border-primary/35 hover:bg-background/70 hover:text-slate-500 dark:text-slate-300 dark:hover:bg-background/70 dark:hover:text-slate-300"
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
                                <MoreHorizontalIcon className="h-4 w-4" />
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
                                    handleUserDetails(item._id);
                                  }}
                                  className="group/item cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary/10 hover:text-blue-600 focus:bg-primary/10 focus:text-blue-600"
                                >
                                  <Eye className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/item:scale-110" />
                                  <span className="font-medium">View</span>
                                </DropdownMenuItem>
                              </motion.div>

                              <motion.div custom={0.05} variants={dropdownItemVariants}>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUserUpdate(item._id);
                                  }}
                                  className="group/item cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary/10 hover:text-blue-600 focus:bg-primary/10 focus:text-blue-600"
                                >
                                  <Pencil className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/item:scale-110" />
                                  <span className="font-medium">Edit</span>
                                </DropdownMenuItem>
                              </motion.div>

                              <DropdownMenuSeparator className="my-1 opacity-50" />

                              {/* <motion.div custom={0.08} variants={dropdownItemVariants}>
                                <DeleteConfirmation onConfirm={() => handleDeleteUser(item._id)}>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={(e) => e.stopPropagation()}
                                    className="group/item cursor-pointer rounded-xl px-3 py-2.5 text-destructive transition-all duration-200 hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/item:scale-110" />
                                    <span className="font-medium">Delete</span>
                                  </DropdownMenuItem>
                                </DeleteConfirmation>
                              </motion.div> */}
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

      <DashboardPagination currentPage={currentPage} totalPage={totalPage} onPageChange={setCurrentPage} layoutId="activeUserPageBubble" />
    </motion.div>
  );
};

export default UserManagement;
