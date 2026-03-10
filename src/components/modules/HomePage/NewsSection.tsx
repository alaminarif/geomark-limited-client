// import { Facebook, Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Loading from "@/components/layout/Loading";
import { useGetClientsQuery } from "@/redux/features/client/client.api";

interface CommunityProps {
  className?: string;
}

export const NewsSection = ({ className }: CommunityProps) => {
  const { data, isLoading } = useGetClientsQuery(undefined);
  if (isLoading) return <Loading />;
  const items = data?.data || [];
  const loopItems = [...items, ...items];

  return (
    <section className={cn("relative py-20 container mx-auto overflow-hidden", className)}>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl uppercase text-blue-800">News and update</h2>
        </motion.div>

        {/* Carousel Track */}
        <motion.div
          className="flex gap-6"
          animate={{
            x: ["3%", "-50%"],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
        >
          {loopItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                min-w-[80%]
                sm:min-w-[45%]
                md:min-w-[30%]
                lg:min-w-[22%]
                group relative rounded-xl 
                 p-6 backdrop-blur-lg
                transition-all duration-300
                hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]
              "
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />

              <div className="relative z-10 text-center border">
                <div className="flex justify-center mb-4">
                  <img src={item.picture} alt={item.name} className="size-64 object-contain" />
                </div>
                <h3 className="mb-1 text-2xl font-bold">{item.name}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
