import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Loading from "@/components/layout/Loading";
import { useGetAllNewssQuery } from "@/redux/features/news/news.api";

interface CommunityProps {
  className?: string;
}

export const NewsSection = ({ className }: CommunityProps) => {
  const { data, isLoading } = useGetAllNewssQuery(undefined);

  if (isLoading) return <Loading />;

  const items = data?.data || [];
  const loopItems = [...items, ...items];

  return (
    <section className={cn("relative py-20 container mx-auto overflow-hidden", className)}>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl uppercase text-blue-800 dark:text-foreground">News and update</h2>
        </motion.div>

        <motion.div
          className="flex gap-6 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
        >
          {loopItems.map((item, index) => (
            <div
              key={index}
              className="group relative shrink-0 w-[90%] sm:w-[70%] lg:w-[calc((100vw-160px)/2)] rounded-xl p-4 md:p-6 backdrop-blur-lg transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]"
            >
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 via-blue-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />

              <div className="relative z-10  md:p-8 border rounded max-w-4xl">
                <div className="flex justify-center mb-6  rounded">
                  <div className="h-72 w-full overflow-hidden rounded-xl">
                    <img src={item.picture} alt={item.name} className="h-full max-w-svw object-cover text-foreground" />
                  </div>
                </div>

                <h3 className="mb-2 text-xl md:text-2xl font-bold text-center text-foreground/70">{item.name}</h3>
                <p className="text-base md:text-lg text-muted-foreground text-justify">{item.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
