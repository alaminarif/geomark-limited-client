import { ExternalLink, Facebook, Linkedin, MessageCircle, Twitter, type LucideIcon } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface CommunitySectionProps {
  className?: string;
}

type CommunityItem = {
  title: string;
  desc: string;
  icon: LucideIcon;
  link: string;
  tone: string;
};

const items: CommunityItem[] = [
  {
    title: "LinkedIn",
    desc: "Follow company updates, project highlights, and career opportunities.",
    icon: Linkedin,
    link: "https://www.linkedin.com/company/geomark-limited-072025",
    tone: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    title: "Facebook",
    desc: "See recent field activities, announcements, and team updates.",
    icon: Facebook,
    link: "https://www.facebook.com/profile.php?id=61565933404947",
    tone: "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300",
  },
  {
    title: "X / Twitter",
    desc: "Catch concise updates, notices, and industry conversations.",
    icon: Twitter,
    link: "https://twitter.com/geomarklimited",
    tone: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  },
  {
    title: "WhatsApp",
    desc: "Start a direct conversation with the Geomark team.",
    icon: MessageCircle,
    link: "https://api.whatsapp.com/send?phone=8801716291050",
    tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const CommunitySection = ({ className }: CommunitySectionProps) => {
  return (
    <section className={cn("container mx-auto py-12 sm:py-14 lg:py-16", className)}>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="mb-4 text-xl font-bold uppercase text-blue-800 sm:text-2xl md:text-3xl lg:text-4xl dark:text-foreground">Connect with Geomark</h2>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            Follow our work, reach the team directly, and stay close to the latest news from Geomark Limited.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariant}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                aria-label={`Open Geomark Limited on ${item.title}`}
                className="group relative flex h-full min-h-50 flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-background/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-blue-500 to-primary opacity-70" />

                <div>
                  <div className={cn("mb-5 flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105", item.tone)}>
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.desc}</p>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-800 transition-colors group-hover:text-primary dark:text-blue-300">
                  Visit channel
                  <ExternalLink className="size-4" />
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
