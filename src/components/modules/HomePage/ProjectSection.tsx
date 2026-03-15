/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { Link, useNavigate } from "react-router";
import ProjectCard from "../Project/ProjectCard";
export const ProjectSection = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { data: projects } = useGetAllProjectsQuery(undefined);
  const ref = useRef(null);

  const handleProjectDetails = (id: string) => {
    navigate(`/project/${id}`);
  };

  return (
    <section ref={ref} className="py-10 container mx-auto overflow-hidden ">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 ">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl uppercase text-blue-800 dark:text-foreground ">Projects</h2>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4 gap-2 sm:gap-3  md:gap-4 lg:gap-6 xl:gap-8  "
        >
          {/* CARDS */}
          {projects?.data?.slice(0, 8).map((item: any) => (
            <ProjectCard key={item?._id} item={item} onView={handleProjectDetails} />
          ))}
        </motion.div>

        <motion.div className="flex justify-end items-center mx-2">
          <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            animate={hovered ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={hovered ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 1.2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/projects"
              className="inline-block mt-4 text-center rounded-xl px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              View More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
