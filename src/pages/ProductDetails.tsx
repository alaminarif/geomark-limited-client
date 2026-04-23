import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, ShoppingCart, MessageCircle, PackageCheck, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import { createBreadcrumbSchema, createProductSchema, truncateText } from "@/lib/seo";
import { useGetSingleProductQuery } from "@/redux/features/product/product.api";
import { useNavigate, useParams } from "react-router";
import SkeletonProductDetails from "@/components/modules/Product/SkeletonProductDetails";
import quantityImg from "@/assets/images/quantity.png";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetSingleProductQuery(id, {
    skip: !id,
  });

  const product = data?.data?.data;
  const canonical = `/product/${id ?? ""}`;

  const images = useMemo(() => {
    const rawImages = [product?.picture, ...(product?.gallery || [])].filter(Boolean);
    return [...new Set(rawImages)];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<string>("");

  const activeImage = selectedImage || images?.[0] || "";

  // const handleBuyNow = () => {
  //   // Replace this with your actual checkout/cart route
  //   navigate(`/checkout/${product?._id || id}`);
  // };

  const handleContactSeller = () => {
    // Replace this with your actual contact route if needed
    navigate(`/contact`);
  };

  if (isLoading) {
    return (
      <>
        <SEO title="Product Details" description="Loading Geomark Limited product details." canonical={canonical} type="product" />
        <SkeletonProductDetails />
      </>
    );
  }

  if (isError || !product) {
    return (
      <>
        <SEO title="Product Not Found" description="The requested Geomark Limited product could not be found." canonical={canonical} noIndex />

        <section className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background/40 text-center">
            <h2 className="text-2xl font-semibold text-foreground">Product not found</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">The product you are looking for does not exist or could not be loaded.</p>

            <button
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
          </div>
        </section>
      </>
    );
  }

  const productName = product?.name || "Product Details";
  const productDescription = product?.description || "View product details from Geomark Limited.";
  const productImage = activeImage || product?.picture;

  return (
    <>
      <SEO
        title={productName}
        description={truncateText(productDescription)}
        image={productImage}
        type="product"
        canonical={canonical}
        jsonLd={[
          createProductSchema({
            name: productName,
            description: productDescription,
            image: productImage,
            path: canonical,
          }),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/product" },
            { name: productName, path: canonical },
          ]),
        ]}
      />

      <section className="container mx-auto overflow-x-hidden px-4 py-8 md:px-6 lg:px-8">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_28%)]" />

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] xl:gap-12">
            {/* Left side */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-border bg-background/50 shadow-sm backdrop-blur">
                <div className="relative h-80 w-full bg-muted sm:h-105 lg:h-140">
                  <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium  backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured Product
                  </div>

                  {activeImage ? (
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={product?.name}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45 }}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image available</div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 p-4 sm:grid-cols-5">
                    {images.map((img: string, index: number) => (
                      <motion.button
                        key={index}
                        whileHover={{ y: -4, scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedImage(img)}
                        className={`overflow-hidden rounded-2xl border bg-background transition ${
                          activeImage === img ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <img src={img} alt={`${product?.name}-${index + 1}`} className="h-20 w-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="space-y-6"
            >
              <div className="rounded-3xl border border-border bg-background/50 p-6 shadow-sm backdrop-blur md:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-purple-500"
                >
                  <PackageCheck className="h-3.5 w-3.5 text-purple-500" />
                  Available for order
                </motion.div>

                <h1 className="mt-4 text-2xl font-bold leading-tight text-foreground md:text-4xl">{product?.name}</h1>

                {product?.description && (
                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="mt-4 text-sm leading-7 text-muted-foreground md:text-base"
                  >
                    {product?.description}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  {product?.quantity !== undefined && (
                    <div className="rounded-2xl border border-border bg-background/60 p-4 transition hover:-translate-y-1">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 ">
                          <img src={quantityImg} alt="Quantity" className="h-5 w-5 text-purple-500" />
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Quantity</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{product?.quantity} in stock</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {product?.price && (
                    <div className="rounded-2xl border border-border bg-background/60 p-4 transition hover:-translate-y-1">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-base font-bold text-purple-500">₦</div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Price</p>
                          <p className="mt-1 text-lg font-semibold text-foreground">{product?.price}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {product?.location && (
                    <div className="w-full rounded-2xl border border-border bg-background/60 p-4 transition hover:-translate-y-1 sm:col-span-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{product?.location}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    // onClick={handleBuyNow}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-purple-500 to-blue-500 px-6 py-3.5 text-sm font-semibold text-primary-foreground  transition hover:opacity-95 sm:w-auto"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Buy Now
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContactSeller}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted sm:w-auto"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact Seller
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;


