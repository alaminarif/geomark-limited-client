/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import { motion } from "framer-motion";

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

const ServiceCard = ({ service, handleOpenModal }: any) => {
  return (
    <div>
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
                  <h3 className="text-base md:text-lg font-semibold text-white line-clamp-1">{service?.name}</h3>
                </div>
              </div>
            </div>
          </Card>
        </GlowCard>
      </motion.div>
    </div>
  );
};

export default ServiceCard;
