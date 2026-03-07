/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import Misson from "@/assets/images/dart-mission-goal-success-svgrepo-com.svg";
import Vision from "@/assets/images/vision.png";
import AboutImage from "@/assets/images/about-image.png";

import { Button } from "@/components/ui/button";
import Client from "./Client";
import { motion, type Variants } from "framer-motion";
import CountUp from "react-countup";

const breakoutCards = [
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

const achievements = [
  { label: "Completed Projects", value: 300 },
  { label: "On Going Projects", value: 8 },
  { label: "Clients", value: 99 },
  { label: "Countries", value: 5 },
  { label: "Years in Business", value: 10 },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

export const AboutPage = () => {
  return (
    <section className={cn("container mx-auto py-20")}>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* HERO / ABOUT */}
        <section className="relative mb-24 overflow-hidden">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <div className="absolute left-1/2 top-0 h-128 w-lg -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-[24rem] rounded-full bg-purple-500/10 blur-3xl" />
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* IMAGE SIDE */}
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl h-full"
            >
              <a
                href="https://maps.app.goo.gl/gmKw37xMmzvaJcvm9"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative z-10 block h-full w-full"
              >
                <motion.img
                  src={AboutImage}
                  alt="About Us"
                  className="h-full w-full cursor-pointer object-cover"
                  initial={{ scale: 1.12 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0, 0, 0.2, 1] }}
                />

                {/* subtle hover ring */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition duration-300 group-hover:ring-white/30" />
              </a>

              {/* overlay */}
              <motion.div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />

              {/* floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute left-4 z-10 top-4 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 px-3 py-1 text-sm font-medium text-white shadow-lg"
              >
                Since 1999
              </motion.div>

              {/* bottom caption */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute bottom-5 left-5 right-5"
              >
                <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
                  Visit our location on Google Maps
                </div>
              </motion.div>
            </motion.div>

            {/* TEXT SIDE */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col justify-center text-center md:text-left"
            >
              <motion.h1 variants={fadeUp} className="mb-6 text-4xl font-semibold leading-tight lg:text-5xl">
                About Us
              </motion.h1>

              <motion.p variants={fadeUp} className="max-w-4xl text-justify text-lg leading-relaxed text-muted-foreground">
                GEOMARK LIMITED is a brand name with specific focus to the Planning and IT Enabled Services (ITES) specializing in the geospatial
                applications including advance topographical survey, consultancy on engineering and architectural design, drawing, supervision,
                planning, software, data entry, webpage development, GIS, CAD, LIS, MIS, AM/FM, processing of remote sensing data, digital mapping and
                surveying using GPS, geo-spatial and textual data conversion, application software and web page solutions development and so forth.
                <br />
                <br />
                Apart from ITES, it provides professional consulting services particularly for undertaking research and development studies and
                projects covering land, natural resources, environment, urban and real estate development, infrastructure development, institution and
                organization studies, land related legislation study, human resources development studies, general education related studies and so
                forth.
                <br />
                <br />
                Geomark Limited was founded in 1999 by a group of IT professionals and engineers having long experience in successful implementation
                of a large number of development studies and consulting projects including GIS and ITES related assignments of various reputed
                clients. The company has successfully implemented software applications in many areas namely corporate, business and production MIS,
                Geographic Information System, Land Information System, CAD systems, stock portfolio and fund management system, materials and
                inventory, record management, data entry systems, environmental information management, web applications development and so on.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* MISSION / VISION */}
        <section className="relative py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-96 w-[24rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {breakoutCards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-muted/40 p-8 backdrop-blur-xl shadow-sm"
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
                    <h3 className="mb-3 text-xl font-semibold tracking-wide">{item.title}</h3>
                    <p className="max-w-xl text-justify leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  asChild
                  className="relative z-10 mr-auto transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                >
                  <a href={item.buttonUrl} target="_blank" rel="noopener noreferrer">
                    {item.buttonText}
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CLIENTS */}
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          <Client />
        </div>

        {/* ACHIEVEMENTS */}
        <section className="relative mt-14 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-slate-950 via-purple-950 to-slate-950 px-6 py-10 shadow-2xl">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 7, repeat: Infinity }}
          >
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
          </motion.div>

          <div className="relative grid grid-cols-2 gap-4 gap-y-8 text-center md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {achievements.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.03 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 backdrop-blur-md"
              >
                <span className="text-4xl font-semibold text-white md:text-5xl">
                  <CountUp end={Number(item.value)} duration={2.2} enableScrollSpy scrollSpyOnce />+
                </span>
                <p className="mt-2 text-sm text-white/80 md:text-base">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};
