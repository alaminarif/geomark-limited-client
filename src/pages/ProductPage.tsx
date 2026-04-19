/* eslint-disable @typescript-eslint/no-explicit-any */
import ProductCard from "@/components/modules/Product/ProductCard";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNavigate } from "react-router";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const ProductPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useGetAllProductsQuery(undefined);

  const products = data?.data || [];
  // console.log("Products:", products[0].name);

  return (
    <section className="container mx-auto overflow-x-hidden px-4 py-8 md:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }} className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Our Products</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">Explore our latest products.</p>
      </motion.div>

      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 xl:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border border-border bg-background/50"
            >
              <div className="h-44 w-full animate-pulse bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key="products-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 xl:gap-6"
          >
            {products.map((product: any) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                layout
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full"
              >
                <ProductCard item={product} onView={(id: string) => navigate(`/product/${id}`)} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex min-h-75 items-center justify-center rounded-2xl border border-dashed border-border bg-background/40"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">No products found</h2>
            <p className="mt-2 text-sm text-muted-foreground">There are no products available right now.</p>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default ProductPage;
