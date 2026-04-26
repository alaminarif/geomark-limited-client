/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useScroll } from "framer-motion";
import { useState } from "react";

import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import Loading from "@/components/layout/Loading";
import ServiceCard from "@/components/modules/Service/ServiceCard";
import { ServiceModal } from "@/components/modules/HomePage/ServiceModal";
import DashboardPagination from "@/components/ui/dashboard-pagination";

const PAGE_SIZE = 8;

export const ServicePage = () => {
  const { scrollYProgress } = useScroll();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useGetAllServicesQuery({
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const rawServices = data?.data || [];
  const hasServerPagination = typeof data?.meta?.totalPage === "number";
  const totalPage = hasServerPagination ? data.meta.totalPage : Math.max(1, Math.ceil(rawServices.length / PAGE_SIZE));
  const services = hasServerPagination ? rawServices : rawServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
            <h2 className="mb-6 text-xl font-bold sm:text-2xl md:text-3xl  lg:text-4 text-chart-2 uppercase">Services</h2>
          </motion.div>

          {/* Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4 gap-2 sm:gap-3  md:gap-4 lg:gap-6 xl:gap-8  ">
            {services.map((service: any) => (
              <ServiceCard key={service._id || service.name} service={service} handleOpenModal={handleOpenModal} />
            ))}
          </div>

          <DashboardPagination currentPage={currentPage} totalPage={totalPage} onPageChange={setCurrentPage} layoutId="activeServicePageBubble" />
        </div>

        <ServiceModal open={open} setOpen={setOpen} service={selectedService} />
        {/* <ServiceDetails /> */}
      </section>

      {/* MODAL */}
    </>
  );
};
