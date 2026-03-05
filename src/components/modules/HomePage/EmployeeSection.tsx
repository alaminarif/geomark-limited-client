/* eslint-disable @typescript-eslint/no-explicit-any */

import { cn } from "@/lib/utils";
import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
import Loading from "@/components/layout/Loading";
import { Facebook, Linkedin } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";

/* Container for staggered animation */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

/* Individual card animation */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const EmployeeSection = () => {
  const [hovered, setHovered] = useState(false);
  const { data, isLoading } = useGetAllEmployeesQuery({ sort: "createdAt" });

  if (isLoading) return <Loading />;

  return (
    <section className={cn("py-20 container mx-auto ")}>
      {/* Section Heading */}
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 ">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl uppercase text-blue-800">Geomark Team</h2>
        </motion.div>

        {/* Employee Cards with staggered scroll reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }} // triggers when 20% visible
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4 gap-2 sm:gap-3  md:gap-4 lg:gap-6 xl:gap-8 "
        >
          {data?.data?.slice(0, 8).map((member: any) => (
            <motion.div
              key={member.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02, boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}
              className="flex flex-col items-center transition-all duration-300"
            >
              <div className="relative my-4 w-75 h-90 rounded-sm overflow-hidden border-2">
                <img src={member.picture} alt={member.name} className="w-full h-full object-cover" />

                {/* SOCIAL ICONS */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                  {/* Facebook */}
                  <motion.a
                    href={member.linkedin || "#"}
                    whileHover={{ y: -6, scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="rounded-lg bg-linear-to-r from-purple-500 to-blue-500 text-white  hover:from-purple-700
hover:to-blue-700  p-2 shadow"
                  >
                    <Linkedin className="size-6 text-white" />
                  </motion.a>

                  {/* LinkedIn */}
                  <motion.a
                    href={member.facebook || "#"}
                    whileHover={{ y: -6, scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="rounded-lg bg-linear-to-r from-purple-500 to-blue-500 text-white hover:from-purple-700
hover:to-blue-700 p-2 shadow"
                  >
                    <Facebook className="size-6 text-white" />
                  </motion.a>
                </div>
              </div>

              <p className="text-center font-medium">{member.name}</p>
              <p className="text-center text-muted-foreground mb-3">{member.designation}</p>
            </motion.div>
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
              to="/services"
              className="inline-block mt-4 text-center rounded-xl px-4 py-2 bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Know More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
