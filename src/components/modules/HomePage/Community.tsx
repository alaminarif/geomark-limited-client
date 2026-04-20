import { Facebook, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface Community2Props {
  className?: string;
}
const items = [
  {
    title: "LinkedIn",
    desc: "Connect with us and explore career opportunities.",
    icon: <Linkedin className="size-14" />,
    link: "https://www.linkedin.com/company/geomark-limited-072025",
  },

  {
    title: "Facebook",
    desc: "Join our Facebook community and stay updated.",
    icon: <Facebook className="size-14" />,
    link: "https://www.facebook.com/profile.php?id=61565933404947",
  },
  {
    title: "Twitter",
    desc: "Follow our latest updates and announcements.",
    icon: <Twitter className="size-14" />,
    link: "https://twitter.com/geomarklimited",
  },
  {
    title: "Whatsapp",
    desc: "Contribute to our open-source projects.",
    icon: <MessageCircle className="size-14" />,
    link: "https://api.whatsapp.com/send?phone=8801716291050",
  },
];
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export const Community = ({ className }: Community2Props) => {
  return (
    <section className={cn("relative pb-10 container mx-auto", className)}>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Title Animation */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl lg:text-4  uppercase text-blue-800 dark:text-foreground">
            Be part of our network
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariant}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              whileTap={{ scale: 0.97 }}
              className="group relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
            >
              {/* Glow border effect */}
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex items-center justify-center text-blue-500"
                >
                  {item.icon}
                </motion.div>

                <div className="mt-4 text-center">
                  <h3 className="mb-1 text-2xl font-bold text-foreground/80">{item.title}</h3>
                  <p className="text-md text-foreground/70">{item.desc}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
