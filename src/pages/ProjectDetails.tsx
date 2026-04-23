import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, useReducedMotion } from "framer-motion";

import Loading from "@/components/layout/Loading";
import ProjectCard from "@/components/modules/Project/ProjectCard";
import ProjectSlideSection from "@/components/modules/Project/ProjectSlideSection";
import SEO from "@/components/SEO";
import { createBreadcrumbSchema, createCreativeWorkSchema, truncateText } from "@/lib/seo";
import { useGetAllProjectsQuery, useGetSingleProjectQuery } from "@/redux/features/project/project.api";

export const title = "Project Details";

type Project = {
  _id: string;
  title?: string;
  name?: string;
  description?: string;
  picture?: string;
  gallery?: string[];
  status?: string;
  startDate?: string;
  endDate?: string;
};

const DEFAULT_BG_IMAGE = "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/christopher-gower-vjMgqUkS8q8-unsplash.jpg";

const text =
  "GEOMARK LIMITED is a brand name with specific focus to the Planning and IT Enabled Services ITES specializing in the geospatial applications including Advance topographical survey; consultancy on Engineering & Architectural Design, Drawing, Supervision, Planning, Software, Data Entry, Webpage Development GIS, CAD, LIS, MIS, AM FM, processing of remote sensing data, digital mapping/surveying using GPS, geo-spatial and textual data conversion, application software and web page; solutions development and so forth.";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const formatProjectDate = (date?: string) => {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const shouldReduceMotion = useReducedMotion();

  const { data: singleProjectRes, isLoading } = useGetSingleProjectQuery(id as string);
  const { data: allProjectsRes } = useGetAllProjectsQuery(undefined);

  const project = singleProjectRes?.data?.data as Project | undefined;
  const canonical = `/project/${id ?? ""}`;
  const allProjects = (allProjectsRes?.data ?? []) as Project[];
  const currentProjectId = project?._id;

  const bgImage = project?.picture || DEFAULT_BG_IMAGE;
  const projectName = project?.name || project?.title || "Project Details";
  const projectDescription = project?.description || "View this Geomark Limited project profile and related consulting work.";

  const keyPoints = text
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);

  const formattedStartDate = formatProjectDate(project?.startDate);
  const formattedEndDate = formatProjectDate(project?.endDate);

  const projectPeriod = useMemo(() => {
    if (formattedStartDate && formattedEndDate) return `${formattedStartDate} - ${formattedEndDate}`;
    if (formattedStartDate) return `From ${formattedStartDate}`;
    if (formattedEndDate) return `Until ${formattedEndDate}`;
    return "";
  }, [formattedStartDate, formattedEndDate]);

  const relatedProjects = currentProjectId ? allProjects.filter((item) => item._id !== currentProjectId).slice(0, 6) : allProjects.slice(0, 6);

  const handleProjectDetails = (projectId: string) => {
    navigate(`/project/${projectId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <>
        <SEO title="Project Details" description="Loading Geomark Limited project details." canonical={canonical} type="article" />
        <Loading />
      </>
    );
  }

  return (
    <>
      <SEO
        title={projectName}
        description={truncateText(projectDescription)}
        image={bgImage}
        canonical={canonical}
        type="article"
        jsonLd={[
          createCreativeWorkSchema({
            name: projectName,
            description: projectDescription,
            image: bgImage,
            path: canonical,
          }),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: projectName, path: canonical },
          ]),
        ]}
      />

      <section className="pb-32">
        {/* Hero */}
        <motion.div
          className="relative flex min-h-130 items-center justify-center overflow-hidden py-32"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgImage})` }}
            animate={shouldReduceMotion ? {} : { scale: 1.06 }}
            transition={{ duration: 8, ease: "easeOut" }}
          />

          <div className="absolute inset-0 bg-black/55" />

          {!shouldReduceMotion && (
            <>
              <motion.div
                className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl"
                animate={{
                  x: [0, 26, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute right-0 top-32 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
                animate={{
                  x: [0, -24, 0],
                  y: [0, 22, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </>
          )}

          <div className="relative z-10 container text-center">
            <motion.div variants={fadeUp}>
              <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-white/90 backdrop-blur-md">
                Featured Project
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mx-auto max-w-5xl text-4xl font-semibold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl"
            >
              {projectName}
            </motion.h1>

            <motion.div variants={fadeUp} className="mx-auto mt-6 h-1 w-24 rounded-full bg-linear-to-r from-purple-500 to-blue-500" />
          </div>
        </motion.div>

        {/* Intro */}
        <div className="py-16">
          <div className="container">
            <motion.div
              className="mx-auto max-w-4xl space-y-8 text-left"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeUp} className="text-3xl font-semibold tracking-tight text-foreground dark:text-primary-foreground md:text-4xl">
                {project?.name}
              </motion.h2>

              <motion.div variants={fadeUp} className="leading-relaxed">
                <h3 className="text-2xl font-semibold text-foreground dark:text-primary-foreground">Project Description:</h3>
                <div className="text-xl text-muted-foreground">{project?.description}</div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {project?.status && (
                    <span className="rounded-full border px-4 py-1 text-sm font-medium text-foreground dark:text-primary-foreground">
                      Status: {project.status}
                    </span>
                  )}

                  {formattedStartDate && (
                    <span className="rounded-full border px-4 py-1 text-sm font-medium text-foreground dark:text-primary-foreground">
                      Start Date: {formattedStartDate}
                    </span>
                  )}

                  {formattedEndDate && (
                    <span className="rounded-full border px-4 py-1 text-sm font-medium text-foreground dark:text-primary-foreground">
                      End Date: {formattedEndDate}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Cinematic Crossfade Gallery */}
              <ProjectSlideSection
                projectId={project?._id}
                projectName={project?.name || project?.title || "Project Showcase"}
                projectDescription={project?.description}
                projectStatus={project?.status}
                projectPeriod={projectPeriod}
                gallery={project?.gallery}
              />
            </motion.div>
          </div>
        </div>

        {/* Objectives and Findings */}
        <div className="py-4">
          <div className="container">
            <motion.div
              className="mx-auto mb-8 max-w-4xl"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h3 variants={fadeUp} className="mb-4 text-2xl font-semibold text-foreground dark:text-primary-foreground">
                Key Objectives:
              </motion.h3>

              <motion.ul variants={staggerContainer} className="list-outside list-disc space-y-2 pl-6 text-muted-foreground">
                {keyPoints.map((item, index) => (
                  <motion.li key={index} variants={fadeUp}>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              className="mx-auto mt-6 max-w-4xl"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.h3 variants={fadeUp} className="mb-4 text-2xl font-semibold text-foreground dark:text-primary-foreground">
                Key Findings:
              </motion.h3>

              <motion.ul variants={staggerContainer} className="list-outside list-disc space-y-2 pl-6 text-muted-foreground">
                {keyPoints.map((item, index) => (
                  <motion.li key={index} variants={fadeUp}>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>

        {/* Related Projects */}
        <div className="container max-w-4xl mx-auto  px-4">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="mb-6 text-xl text-foreground font-bold sm:text-2xl md:text-3xl lg:text-4xl">
              Related Projects
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3 xl:gap-8"
              variants={staggerContainer}
            >
              {relatedProjects.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={scaleIn}
                  whileHover={shouldReduceMotion ? {} : { y: -8 }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 18,
                    delay: index * 0.03,
                  }}
                >
                  <ProjectCard item={item} onView={handleProjectDetails} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetails;
