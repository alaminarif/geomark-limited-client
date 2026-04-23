import AboutImage from "@/assets/images/about-image.png";
import { motion, type Variants } from "framer-motion";

const ABOUT_PARAGRAPHS = [
  `GEOMARK LIMITED is a brand name with specific focus to the Planning and IT Enabled Services (ITES) specializing in the geospatial applications including advance topographical survey, consultancy on engineering and architectural design, drawing, supervision, planning, software, data entry, webpage development, GIS, CAD, LIS, MIS, AM/FM, processing of remote sensing data, digital mapping and surveying using GPS, geo-spatial and textual data conversion, application software and web page solutions development and so forth.`,
  `Apart from ITES, it provides professional consulting services particularly for undertaking research and development studies and projects covering land, natural resources, environment, urban and real estate development, infrastructure development, institution and organization studies, land related legislation study, human resources development studies, general education related studies and so forth.`,
  `Geomark Limited was founded in 1999 by a group of IT professionals and engineers having long experience in successful implementation of a large number of development studies and consulting projects including GIS and ITES related assignments of various reputed clients. The company has successfully implemented software applications in many areas namely corporate, business and production MIS, Geographic Information System, Land Information System, CAD systems, stock portfolio and fund management system, materials and inventory, record management, data entry systems, environmental information management, web applications development and so on.`,
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

export default function AboutHeroSection() {
  return (
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
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full overflow-hidden rounded-2xl"
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

            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 transition duration-300 group-hover:ring-white/30" />
          </a>

          <motion.div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"
            initial={{ opacity: 0.8 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 px-3 py-1 text-sm font-medium text-foreground shadow-lg"
          >
            Since 1999
          </motion.div>

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

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col justify-center text-center md:text-left"
        >
          <motion.h1 variants={fadeUp} className="mb-6 text-4xl font-semibold leading-tight text-blue-800 dark:text-foreground lg:text-5xl">
            About Us
          </motion.h1>

          <motion.div variants={fadeUp} className="max-w-4xl space-y-6 text-justify text-lg leading-relaxed text-muted-foreground">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
