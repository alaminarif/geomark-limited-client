import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eye, MapPin, Package, Wallet } from "lucide-react";

type Product = {
  _id?: string;
  name: string;
  description?: string;
  location?: string;
  price?: number | string;
  quantity?: number;
  picture?: string;
  gallery?: string[];
};

type Props = {
  item: Product;
  onView: (id: string) => void;
};

const ProductCard = ({ item, onView }: Props) => {
  const imageSrc = item?.picture || item?.gallery?.[0] || "/placeholder.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group overflow-hidden rounded-2xl border border-muted bg-background/40"
    >
      <div className="relative">
        {/* Product image */}
        <motion.img
          src={imageSrc}
          alt={item?.name}
          className="h-40 w-full shrink-0 object-cover text-foreground/80"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Quantity badge */}
        <motion.p
          className="absolute top-2 right-2 rounded-md bg-black/30 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur"
          animate={{ scale: [1, 1.06, 1], opacity: [1, 0.9, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          Qty: {item?.quantity ?? 0}
        </motion.p>

        <div className="min-w-0 flex-1 p-3">
          <h3 className="line-clamp-2 wrap-break-word text-sm font-semibold leading-snug text-foreground/80">{item?.name}</h3>

          {/* <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item?.description || "No description available"}</p> */}

          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-purple-500 shrink-0" />
              <span className="line-clamp-1">{item?.location || "-"}</span>
            </div>

            {/* Price and quantity */}
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <Wallet size={15} className="text-purple-500 shrink-0" />
                <span>{item?.price !== undefined ? `৳ ${item.price}` : "-"}</span>
              </span>

              <span className="flex items-center gap-2">
                <Package size={15} className="text-purple-500 shrink-0" />
                <span>{item?.quantity ?? 0}</span>
              </span>
            </div>
          </div>

          <div className="mt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => onView(item?._id || "")} className="w-full bg-linear-to-r from-purple-500 to-blue-500">
                View Details
                <Eye className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Glow ring */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-transparent transition duration-300 group-hover:ring-purple-500/40" />
      </div>
    </motion.div>
  );
};

export default ProductCard;
