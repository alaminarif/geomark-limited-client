/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import Loading from "@/components/layout/Loading";
import { useNavigate } from "react-router";
import { ServiceModal } from "./ServiceModal";

function GlowCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={handleMove} className="relative group w-full">
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        [background:radial-gradient(250px_at_var(--x)_var(--y),rgba(139,92,246,0.15),transparent_70%)]"
      />
      {children}
    </div>
  );
}

export const ServiceSection = () => {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();

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

      <section className="py-20 overflow-hidden">
        {/* ✅ FIX: make container full width so the grid doesn't collapse */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-16 flex flex-col items-center gap-16">
          {/* Header */}
          <div className="text-center max-w-3xl">
            <h2 className="mb-4 text-4xl font-semibold text-muted-foreground dark:text-white">Services</h2>

            <p className="mb-12 w-10/12 mx-auto font-medium text-muted-foreground md:text-xl">
              Discover the latest trends, tips, and best practices in modern web development.
            </p>

            <Button
              onClick={() => navigate("/services")}
              className="w-6/12 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              View All Services
            </Button>
          </div>

          {/* Cards */}

          <div className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ">
            {services.slice(0, 9).map((service: any) => (
              <motion.div key={service._id} whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 200 }} className="w-full ">
                <GlowCard>
                  <Card
                    onClick={() => handleOpenModal(service)}
                    className="group cursor-pointer w-full h-64 md:h-72 rounded-2xl overflow-hidden p-0 m-0
  transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                  >
                    <div className="relative h-full w-full">
                      <img
                        src={service?.picture}
                        alt={service?.name}
                        className="absolute inset-0 h-full w-full object-cover
      transition-transform duration-500 ease-out will-change-transform
      group-hover:scale-[1.1]"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/15 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="inline-flex w-full bg-black/25 backdrop-blur-md  px-2">
                          <h3 className="text-base md:text-lg font-semibold text-white line-clamp-2">{service?.name}</h3>
                        </div>
                      </div>
                    </div>
                  </Card>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      <ServiceModal open={open} setOpen={setOpen} service={selectedService} />
    </>
  );
};
