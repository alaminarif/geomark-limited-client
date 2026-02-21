/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
import Loading from "@/components/layout/Loading";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import { motion, type Variants } from "framer-motion";

interface EmployeeSectionProps {
  heading?: string;
  description?: string;
}

/* Container for staggered animation */
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2, // delay between each card
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

export const EmployeeSection = ({
  heading = "Team",
  description = "Our diverse team of experts brings together decades of experience in design, engineering, and product development.",
}: EmployeeSectionProps) => {
  const { data, isLoading } = useGetAllEmployeesQuery(undefined);

  if (isLoading) return <Loading />;

  return (
    <section className={cn("py-20")}>
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container flex flex-col items-center text-center"
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
        className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4"
      >
        {data?.data?.map((member: any) => (
          <motion.div
            key={member.id}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, boxShadow: "0 0 20px rgba(139,92,246,0.3)" }}
            className="flex flex-col items-center transition-all duration-300"
          >
            <Avatar className="my-4 size-20 border md:mb-5 lg:size-24">
              <AvatarImage src={member.picture} />
              <AvatarFallback>{member.name}</AvatarFallback>
            </Avatar>

            <p className="text-center font-medium">{member.name}</p>
            <p className="text-center text-muted-foreground">{member.designation}</p>

            <div className="flex gap-3 my-4">
              <a href={member.facebook || "#"} className="rounded-lg bg-muted/50 p-2">
                <Facebook className="size-4 text-muted-foreground" />
              </a>
              <a href={member.linkedin || "#"} className="rounded-lg bg-muted/50 p-2">
                <Linkedin className="size-4 text-muted-foreground" />
              </a>
              <a href={member.twitter || "#"} className="rounded-lg bg-muted/50 p-2">
                <Twitter className="size-4 text-muted-foreground" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
