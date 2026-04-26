import { useMemo } from "react";

import Misson from "@/assets/images/dart-mission-goal-success-svgrepo-com.svg";
import Vision from "@/assets/images/vision.png";
import AchievementsSection, { type AchievementItem } from "@/components/modules/About/AchievementsSection";
import AboutClientsSection from "@/components/modules/About/AboutClientsSection";
import AboutHeroSection from "@/components/modules/About/AboutHeroSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetClientsQuery } from "@/redux/features/client/client.api";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { motion } from "framer-motion";

type BreakoutCard = {
  title: string;
  text: string;
  src: string;
  buttonText: string;
  buttonUrl: string;
};

type AboutProject = {
  status?: string;
};

type AboutClient = {
  _id?: string;
  name: string;
  picture?: string | null;
  link?: string;
};

const FOUNDING_YEAR = 2008;

const BREAKOUT_CARDS: BreakoutCard[] = [
  {
    title: "MISSION",
    text: `Mission of the GEOMARK LIMITED is to improve the quality of mass people’s life by active contribution in the thrust business sectors of Bangladesh through responsible application of knowledge, skill and technology. Is committed to create a large pool of satisfied customers by providing the highest level of service value, trust and goodwill. GEOMARK believes its customers to get benefited, i.e. company is committed to be developed as a Customer Focused Organization. So, surveying the interest of valued customers is our utmost priority. We have developed an extremely qualified support staffs to meet the expectations and ensure the customers’ satisfaction. We work as a team in every sense of the word.`,
    src: Misson,
    buttonText: "Discover more",
    buttonUrl: "https://shadcnblocks.com",
  },
  {
    title: "VISION",
    text: `GEOMARK LIMITED will adopt strategies that ensure excellence in products, process and services to make customer’s investment worthy. Use resources, adaptation of appropriate technology effectively and efficiently to attain a high level of productivity in all its operations. Encourage and assist in the qualitative improvement of services for its internal and external customers. Encourage an environment where personal growth and learning of the employee is assured.`,
    src: Vision,
    buttonText: "Discover more",
    buttonUrl: "https://shadcnblocks.com",
  },
];

function BreakoutCardsSection() {
  return (
    <section className="relative py-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-[24rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {BREAKOUT_CARDS.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-8 shadow-sm backdrop-blur-xl"
          >
            <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-purple-500/10" />
            </div>

            <div className="relative z-10">
              <motion.img
                src={item.src}
                alt={item.title}
                className="h-20 w-fit dark:invert"
                whileHover={{ rotate: -3, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
              />

              <div className="my-6">
                <h3 className="mb-3 text-xl font-semibold tracking-wide text-muted-foreground">{item.title}</h3>
                <p className="max-w-xl text-justify leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </div>

            <Button
              variant="outline"
              asChild
              className="relative z-10 mr-auto text-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
            >
              <a href={item.buttonUrl} target="_blank" rel="noopener noreferrer">
                {item.buttonText}
              </a>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export const AboutPage = () => {
  const { data: projectsData } = useGetAllProjectsQuery(undefined);
  const { data: clientsData } = useGetClientsQuery({ sort: "-des", limit: 12 });

  const projectItems = useMemo(() => (projectsData?.data || []) as AboutProject[], [projectsData]);
  const clientItems = useMemo(() => (clientsData?.data || []) as AboutClient[], [clientsData]);

  const achievements = useMemo<AchievementItem[]>(
    () => [
      {
        label: "Completed Projects",
        value: projectItems.filter((project) => project.status === "COMPLETED").length,
        suffix: "+",
      },
      {
        label: "Ongoing Projects",
        value: projectItems.filter((project) => project.status === "ONGOING").length,
        suffix: "+",
      },
      {
        label: "Clients",
        value: clientItems.length,
        suffix: "+",
      },
      {
        label: "Years in Business",
        value: Math.max(new Date().getFullYear() - FOUNDING_YEAR, 0),
        suffix: "",
      },
    ],
    [clientItems.length, projectItems],
  );

  return (
    <section className={cn("container mx-auto py-20")}>
      <div className="px-4 sm:px-6 lg:px-8">
        <AboutHeroSection />
        <BreakoutCardsSection />

        {clientItems.length > 0 && <AboutClientsSection clients={clientItems} />}

        <AchievementsSection achievements={achievements} />
      </div>
    </section>
  );
};
