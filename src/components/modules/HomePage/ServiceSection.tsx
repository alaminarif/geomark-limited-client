/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useScroll } from "framer-motion";
import { useState } from "react";

import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import Loading from "@/components/layout/Loading";
import { ServiceModal } from "./ServiceModal";
import ServiceCard from "../Service/ServiceCard";
import { Link } from "react-router";

export const ServiceSection = () => {
  const { scrollYProgress } = useScroll();
  const [hovered, setHovered] = useState(false);

  const { data, isLoading } = useGetAllServicesQuery(undefined);
  const services = data?.data || [];

  const [selectedService, setSelectedService] = useState<any>(null);
  const [open, setOpen] = useState(false);

  if (isLoading) return <Loading />;

  const handleOpenModal = (service: any) => {
    setSelectedService(service);
    setOpen(true);
  };

  return (
    <>
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed left-0 top-0 h-0.75 w-full origin-left bg-violet-500 z-50" />

      <section className="container mx-auto py-20 overflow-hidden">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl uppercase text-blue-800 dark:text-foreground">Sectors</h2>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4 gap-2 sm:gap-3  md:gap-4 lg:gap-6 xl:gap-8  ">
            {services.slice(0, 8).map((service: any) => (
              <ServiceCard service={service} handleOpenModal={handleOpenModal} />
            ))}
          </div>

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
                View More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MODAL */}
      <ServiceModal open={open} setOpen={setOpen} service={selectedService} />
    </>
  );
};
