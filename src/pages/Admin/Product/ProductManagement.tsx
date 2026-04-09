import { useState } from "react";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useDeleteProductMutation, useGetAllProductsQuery } from "@/redux/features/product/product.api";

import { SkeletonProductManagement } from "@/components/modules/Admin/Product/SkeletonProductManagement";
import AddProductModal from "@/components/modules/Admin/Product/AddProduct";

type TProduct = {
  _id: string;
  picture: string;
  name: string;
  location: string;
  price: string;
  quantity: string;
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

const ProductManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllProductsQuery(undefined);
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleDeleteProduct = async (productId: string) => {
    const toastId = toast.loading("Deleting client...");

    try {
      const res = await deleteProduct(productId).unwrap();

      if (res.success) {
        toast.success("Product deleted successfully", { id: toastId });

        if (selectedProductId === productId) {
          setSelectedProductId(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete Product", { id: toastId });
      console.log(error);
    }
  };

  const handleProductDetails = (id: string) => {
    navigate(`/admin/product/${id}`);
  };

  if (isLoading) {
    return <SkeletonProductManagement />;
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="w-full max-w-7xl mx-auto px-5">
      <motion.div variants={headerVariants} className="flex items-center justify-between my-6">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="text-2xl font-bold tracking-tight">Product</h1>
          {/* <p className="mt-1 text-sm text-muted-foreground">Manage clients with a cleaner premium dashboard feel</p> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AddProductModal />
        </motion.div>
      </motion.div>

      <motion.div
        variants={shellVariants}
        initial="hidden"
        animate="visible"
        className="relative rounded-3xl border border-border/50 bg-background/70 p-3 backdrop-blur-xl shadow-[0_16px_60px_-20px_rgba(0,0,0,0.35)]"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

        <Table className="border-separate [border-spacing:0_10px]">
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image</TableHead>
              <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</TableHead>
              <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</TableHead>

              <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</TableHead>
              <TableHead className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantity</TableHead>
              <TableHead className="px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data?.map((item: TProduct, index: number) => {
              const baseDelay = 0.08 + index * 0.05;
              const isSelected = selectedProductId === item._id;
              const toneClass = isSelected ? "border-primary/35 bg-primary/[0.06]" : "border-border/50 bg-background/80";

              return (
                <TableRow
                  key={item._id}
                  onClick={() => setSelectedProductId(item._id)}
                  className="group cursor-pointer border-none hover:bg-transparent"
                >
                  <TableCell className={`relative rounded-l-2xl border-y border-l px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                    {isSelected && (
                      <motion.div
                        layoutId="selected-row-indicator"
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
                        src={item.picture}
                        alt={item.name}
                        className="relative w-24 h-20 min-w-24 min-h-20 rounded-xl border border-border/50 object-fit shadow-md"
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
                    <motion.div
                      custom={baseDelay + 0.03}
                      variants={cellVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        className="font-medium"
                        whileHover={{ x: 3 }}
                        animate={isSelected ? { x: 2 } : { x: 0 }}
                        transition={{ type: "spring", stiffness: 260 }}
                      >
                        {item.name}
                      </motion.span>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.85, y: 6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 6 }}
                            transition={{ duration: 0.18 }}
                            className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary"
                          >
                            Selected
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </TableCell>

                  <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                    <motion.div
                      custom={baseDelay + 0.06}
                      variants={cellVariants}
                      initial="hidden"
                      animate="visible"
                      className="font-medium text-sm text-foreground/90"
                    >
                      {item.price}
                    </motion.div>
                  </TableCell>

                  <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                    <motion.div
                      custom={baseDelay + 0.12}
                      variants={cellVariants}
                      initial="hidden"
                      animate="visible"
                      className="font-medium text-sm text-foreground/90"
                    >
                      {item.location}
                    </motion.div>
                  </TableCell>

                  <TableCell className={`border-y px-4 py-3 align-middle transition-all duration-300 ${toneClass}`}>
                    <motion.div
                      custom={baseDelay + 0.12}
                      variants={cellVariants}
                      initial="hidden"
                      animate="visible"
                      className="font-medium text-sm text-foreground/90"
                    >
                      {item.quantity}
                    </motion.div>
                  </TableCell>

                  <TableCell className={`rounded-r-2xl border-y border-r px-4 py-3 text-right align-middle transition-all duration-300 ${toneClass}`}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
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
                                  handleProductDetails(item._id);
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
                                  navigate(`/admin/product/${item._id}/edit`);
                                }}
                                className="group/item cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary/10 focus:bg-primary/10"
                              >
                                <Pencil className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/item:scale-110" />
                                <span className="font-medium">Edit</span>
                              </DropdownMenuItem>
                            </motion.div>

                            <DropdownMenuSeparator className="my-1 opacity-50" />

                            <motion.div custom={0.08} variants={dropdownItemVariants}>
                              <DeleteConfirmation onConfirm={() => handleDeleteProduct(item._id)}>
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
      </motion.div>
    </motion.div>
  );
};

export default ProductManagement;
