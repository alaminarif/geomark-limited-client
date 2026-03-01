/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";

import { useNavigate } from "react-router";
export const ProjectSection = () => {
  const Navigate = useNavigate();
  const { data: projects } = useGetAllProjectsQuery(undefined);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const handleProject = () => {
    Navigate("/projects");
  };
  const handleProjectDaetails = (id: string) => {
    Navigate(`/project/${id}`);
  };

  return (
    <section ref={ref} className={cn("py-24 container mx-auto overflow-hidden ")}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={inView && { opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className=" grid grid-cols-1 gap-10 lg:grid-cols-3 mx-6"
      >
        {/* LEFT */}
        <div className="flex flex-col justify-between lg:col-span-1">
          <div>
            <h2 className="mb-4 text-4xl font-medium md:text-6xl">Featured Projects</h2>
            <p className="w-72 text-muted-foreground">We offer comprehensive digital solutions to help your business grow.</p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleProject}
              className="w-6/12 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              View All Projects
              <motion.div whileHover={{ rotate: 45, scale: 1.2 }} className="text-white ml-2 h-4 w-4">
                <ArrowUpRight />
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          {/* BIG CARDS */}
          {projects?.data?.slice(0, 2).map((project: any, i: number) => (
            <motion.div
              layout
              layoutId={`card-${i}`}
              key={i}
              onClick={() => handleProjectDaetails(project._id)}
              whileHover={{ scale: 0.97 }}
              className="group"
            >
              <Card className="relative aspect-3/4 overflow-hidden border-0">
                <motion.img
                  layoutId={`image-${i}`}
                  src={project?.picture}
                  alt={project?.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                <CardContent className="absolute z-10 flex justify-between px-6 top-0 bg-black/25 backdrop-blur-md">
                  <motion.div layoutId={`title-${i}`} className="font-semibold text-white">
                    {project.name}
                  </motion.div>

                  <motion.div whileHover={{ rotate: 45, scale: 1.2 }} className="text-white">
                    <ArrowUpRight />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* SMALL CARDS */}
          <motion.div layout className="col-span-full grid grid-cols-1 gap-4 sm:grid-cols-3">
            {projects?.data?.slice(2).map((project: any, i: number) => (
              <motion.div
                layout
                layoutId={`card-${i + 2}`}
                key={i}
                onClick={() => handleProjectDaetails(project._id)}
                whileHover={{ scale: 0.95 }}
                className="group"
              >
                <Card className="relative aspect-4/3 overflow-hidden border-0">
                  <motion.img
                    layoutId={`image-${i + 2}`}
                    src={project?.picture}
                    alt={project?.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                  <CardContent className="absolute top-0 z-10 flex justify-between bg-black/25 backdrop-blur-md w-full px-2 ">
                    <motion.div layoutId={`title-${i + 2}`} className="text-sm font-semibold text-white">
                      {project.title}
                    </motion.div>

                    <ArrowUpRight className="text-white" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
