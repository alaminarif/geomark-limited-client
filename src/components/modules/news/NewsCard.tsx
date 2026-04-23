import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

interface NewsItem {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  picture: string;
}

interface NewsCardProps {
  item: NewsItem;
  index: number;
  copy: "first" | "second";
  setCardRef?: (el: HTMLDivElement | null) => void;
  onOpen?: (item: NewsItem) => void;
}

const NewsCard = ({ item, index, copy, setCardRef, onOpen }: NewsCardProps) => {
  return (
    <motion.div
      ref={setCardRef}
      key={`${item._id || item.id || item.name}-${copy}-${index}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="group relative shrink-0 w-[86vw] sm:w-[66vw] md:w-[58vw] lg:w-[calc((100vw-180px)/2)] xl:w-135 rounded-2xl p-3 sm:p-4 md:p-5"
    >
      <div className="absolute inset-0 rounded-2xl border border-blue-400/35 bg-background/55 backdrop-blur-xl transition-all duration-300 group-hover:border-blue-500/60 dark:border-violet-300/35 dark:group-hover:border-violet-300/70" />

      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/0 via-blue-500/10 to-cyan-500/0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 overflow-hidden rounded-2xl border border-blue-400/25 bg-background/85 p-3 sm:p-4 shadow-sm dark:border-violet-300/25">
        <div className="mb-4 overflow-hidden rounded-xl">
          <div className="h-52 w-full overflow-hidden rounded-xl bg-muted sm:h-60 md:h-72 lg:h-80">
            <img
              src={item.picture}
              alt={item.name}
              loading="lazy"
              className="block h-full w-full text-foreground object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </div>

        <h3 className="mb-2 text-center text-lg font-bold text-foreground/90 sm:text-xl md:text-2xl">{item.name}</h3>

        <p className="line-clamp-3 text-justify text-sm leading-6 text-muted-foreground  sm:text-[15px] md:text-base md:leading-7">
          {item.description}
        </p>

        <div className="mt-4 flex justify-center">
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.(item);
            }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-blue-400 bg-background/80 px-5 text-sm font-medium text-blue-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-blue-600 da hover:text-white hover:shadow-md dark:border-blue-400/40 dark:text-foreground/80  dark:hover:text-foreground"
          >
            Read More
            <Newspaper className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;
