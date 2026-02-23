/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import Misson from "@/assets/images/dart-mission-goal-success-svgrepo-com.svg";
import Vision from "@/assets/images/vision.png";
import AboutImage from "@/assets/images/about-photo.jpg";

import { Button } from "@/components/ui/button";
import Client from "./Client";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const breakoutCards = [
  {
    title: "MISSION",
    text: `Mission of the GEOMARK LIMITED is to improve the quality of mass people’s life by active contribution in the thrust business sectors of Bangladesh through responsible application of knowledge, skill and technology. Is committed to create a large pool of satisfied customers by providing the highest level of service value, trust and goodwill. GEOMARK believes its customers to get benefited, i.e. company is committed to be developed as a Customer Focused Organization. So, surveying the interest of valued customers is our utmost priority. We have developed an extremely qualified support staffs to meet the expectations and ensure the customers’ satisfaction. We work as a team in every sense of the word.`,
    src: Misson,
  },
  {
    title: "VISION",
    text: `GEOMARK LIMITED will adopt strategies that ensure excellence in products, process and services to make customer’s investment worthy. Use resources, adaptation of appropriate technology effectively and efficiently to attain a high level of productivity in all its operations. Encourage and assist in the qualitative improvement of services for its internal and external customers.
Encourage an environment where personal growth and learning of the employee is assured.`,
    src: Vision,
  },
];

export const AboutPage = ({ ...props }) => {
  const { title, mainImage, breakout, achievementsTitle, achievementsDescription, achievements } = {
    ...defaultProps,
    ...props,
  };
  return (
    <section className={cn("py-32")}>
      <div className="container mx-auto">
        <section className="relative mb-24 overflow-hidden">
          {/* 🌈 Animated subtle background */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-purple-500/10 blur-3xl" />
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* 🖼 IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative h-full w-full overflow-hidden rounded-2xl"
            >
              {/* Parallax zoom */}
              <motion.img
                src={mainImage.src}
                alt={mainImage.alt}
                className="h-full w-full object-cover"
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />

              {/* Overlay fade */}
              <motion.div
                className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 absolute top-4 left-4 px-3 py-1 text-sm font-medium"
              >
                Since 2026
              </motion.div>
            </motion.div>

            {/* 📝 TEXT */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.18 },
                },
              }}
              className="flex flex-col justify-center text-center md:text-left"
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7 }}
                className="mb-6 text-4xl font-semibold leading-tight lg:text-5xl"
              >
                {title}
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7 }}
                className="max-w-4xl text-justify text-lg leading-relaxed text-muted-foreground"
              >
                GEOMARK LIMITED is a brand name with specific focus to the Planning and IT Enabled Services (ITES) specializing in the geospatial
                applications including Advance topographical survey, consultancy on Engineering & Architectural Design, Drawing, Supervision,
                Planning, Software, Data Entry , Webpage Development GIS, CAD, LIS, MIS, AM/FM, processing of remote sensing data, digital
                mapping/surveying using GPS, geo-spatial and textual data conversion, application software and web page/solutions development and so
                forth.
                <br />
                Apart from ITES,provides professional consulting services particularly for undertaking research and development studies/projects
                covering and not limited to land, natural resources, environment, urban/real estate development, infrastructure development,
                institution and organization studies, land related legislation study, human resources development studies, general education related
                studies, and so forth.
                <br />
                Geomark Limited. Was founded in 1999 by a group of IT professionals and engineers having long experiences in successful implementation
                of a large number of development studies and consulting projects including GIS and ITES related assignments of various reputed clients
                has successfully implemented software applications in many areas namely, Corporate, Business and Production MIS; Geographic
                Information System; Land Information System, CAD systems; Stock Portfolio and Fund Management System; Materials & Inventory; Record
                Management; Data Entry Systems, Environmental Information Management; Web applications development and so on. In 2007, Geomark Ltd got
                ownership Trade License from Dhaka City Corporation and in 2012 AD Geomark Ltd achieved Joint Stock Company Registration. Geomark
                Limited. Is now backed by an expert panel of consultants and advisors, who are drawn from professionals and Experts of the highest
                caliber from the respective
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="relative py-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-100 w-100 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {breakoutCards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-muted/40 p-8 backdrop-blur-xl"
              >
                {/* ✨ hover glow */}
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-purple-500/10" />
                </div>

                {/* 🖼 icon */}
                <motion.img
                  src={item.src}
                  alt={item.title}
                  className="h-20 w-fit dark:invert"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />

                <div className="my-6">
                  <h3 className="mb-3 text-xl font-semibold tracking-wide">{item.title}</h3>

                  <p className="max-w-xl text-justify leading-relaxed text-muted-foreground">{item.text}</p>
                </div>

                <Button variant="outline" asChild className="mr-auto transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <a href={breakout.buttonUrl} target="_blank">
                    {breakout.buttonText}
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-8">
          <Client />
        </div>

        <div className="relative overflow-hidden rounded-xl p-7 md:p-16">
          {/* 📝 Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-4 text-center md:text-left"
          >
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{achievementsTitle}</h2>

            <p className="max-w-xl text-white/90">{achievementsDescription}</p>
          </motion.div>

          {/* 🔢 Stats */}
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 text-center lg:grid-cols-4">
            {achievements.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="flex flex-col gap-2"
              >
                {/* ✅ COUNTER */}
                <span className="text-4xl font-semibold md:text-5xl text-white">
                  <CountUp
                    end={Number(item.value)} // ⚠️ must be number
                    duration={2.2}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  +
                </span>

                <p className="text-sm text-white/80 md:text-base">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const defaultCompanies = [
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
    alt: "Arc",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
    alt: "Descript",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg",
    alt: "Mercury",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg",
    alt: "Ramp",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg",
    alt: "Retool",
  },
  {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg",
    alt: "Watershed",
  },
];

const defaultAchievements = [
  { label: "Companies ", value: 300 },
  { label: "Projects Finalized", value: 800 },
  { label: "Happy Customers", value: 99 },
  { label: "Recognized Awards", value: 10 },
];

const defaultProps = {
  title: "About Us",
  description: "Shadcnblocks is a passionate team dedicated to creating innovative solutions that empower businesses to thrive in the digital age.",
  mainImage: {
    src: AboutImage,
    alt: "placeholder",
  },
  secondaryImage: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg",
    alt: "placeholder",
  },
  breakout: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
    alt: "logo",
    title: "Hundreds of blocks at Shadcnblocks.com",
    description: "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
    buttonText: "Discover more",
    buttonUrl: "https://shadcnblocks.com",
  },
  companiesTitle: "Valued by clients worldwide",
  companies: defaultCompanies,
  achievementsTitle: "Our Achievements in Numbers",
  achievementsDescription: "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
  achievements: defaultAchievements,
};
