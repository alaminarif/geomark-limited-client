/* eslint-disable @typescript-eslint/no-explicit-any */

import { cn } from "@/lib/utils";
import { Facebook, Linkedin } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router";
import { useState } from "react";

/* Container for staggered animation */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

/* Individual card animation */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

type EmployeeSectionProps = {
  employees?: any[];
};

export const EmployeeSection = ({ employees = [] }: EmployeeSectionProps) => {
  const [hovered, setHovered] = useState(false);
  if (!employees.length) return null;

  return (
    <section className={cn("container mx-auto py-20")}>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Section Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
          <h2 className="mb-6 text-xl font-bold uppercase text-blue-800 dark:text-foreground sm:text-2xl md:text-3xl lg:text-4xl">Geomark Team</h2>
        </motion.div>

        {/* Employee Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8"
        >
          {employees.map((member: any) => {
            const hasLinkedin = Boolean(member?.linkedin?.trim?.());
            const hasFacebook = Boolean(member?.facebook?.trim?.());

            return (
              <motion.div
                key={member?._id || member?.id || member?.email || member?.name}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.25 },
                }}
                className="group flex flex-col items-center"
              >
                <div className="relative my-4 w-full max-w-75 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="aspect-5/6 w-full overflow-hidden">
                    <img
                      src={member?.picture || "/placeholder-user.jpg"}
                      alt={member?.name || "Employee"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {(hasLinkedin || hasFacebook) && (
                    <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-3">
                      {hasLinkedin && (
                        <motion.a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -4, scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          className="rounded-lg bg-linear-to-r from-purple-500 to-blue-500 p-2 text-white shadow"
                          aria-label={`${member?.name} LinkedIn`}
                        >
                          <Linkedin className="size-5" />
                        </motion.a>
                      )}

                      {hasFacebook && (
                        <motion.a
                          href={member.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -4, scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          className="rounded-lg bg-linear-to-r from-purple-500 to-blue-500 p-2 text-white shadow"
                          aria-label={`${member?.name} Facebook`}
                        >
                          <Facebook className="size-5" />
                        </motion.a>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-center text-base font-semibold text-foreground/90">{member?.name}</p>
                <p className="mb-3 text-center text-sm text-foreground/70">{member?.designation}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Button */}
        <motion.div className="flex justify-end items-center mx-2">
          <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            animate={hovered ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={hovered ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 1.2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/employees"
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
