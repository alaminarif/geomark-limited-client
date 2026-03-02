/* eslint-disable @typescript-eslint/no-explicit-any */

import { cn } from "@/lib/utils";
import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
import Loading from "@/components/layout/Loading";
import { Facebook, Linkedin } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface EmployeeSectionProps {
  heading?: string;
  description?: string;
}

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

const facebookHover = {
  backgroundColor: "#5641b8",
};

const linkedinHover = {
  backgroundColor: "#5641b8",
};

export const EmployeeSection = ({
  heading = "Team",
  description = "Our diverse team of experts brings together decades of experience in design, engineering, and product development.",
}: EmployeeSectionProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllEmployeesQuery({ sort: "createdAt" });

  const handleAllTeamMembers = () => {
    navigate("/employees");
  };

  if (isLoading) return <Loading />;

  return (
    <section className={cn("py-20 container mx-auto ")}>
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center"
      >
        <h2 className="my-6 text-2xl font-bold text-pretty lg:text-4xl">{heading}</h2>
        <p className="mb-12 w-6/12 mx-auto font-medium text-muted-foreground md:text-xl">{description}</p>
      </motion.div>

      {/* Employee Cards with staggered scroll reveal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }} // triggers when 20% visible
        className="container mt-16 grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-3"
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
                  whileHover={{ y: -6, scale: 1.15, rotate: 6, ...linkedinHover }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="rounded-lg bg-black/25 backdrop-blur-md p-2 shadow"
                >
                  <Linkedin className="size-6 text-white" />
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href={member.facebook || "#"}
                  whileHover={{ y: -6, scale: 1.15, rotate: 6, ...facebookHover }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="rounded-lg bg-black/25 backdrop-blur-md p-2 shadow"
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

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex justify-end items-center mx-12">
        <Button
          onClick={handleAllTeamMembers}
          className="w-50  rounded-xl py-4 bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          Know More..
        </Button>
      </motion.div>
    </section>
  );
};
