/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import Loading from "@/components/layout/Loading";
import { useNavigate } from "react-router";
import { Magnetic } from "@/utils/Magnetic";

//  Hover-follow Glow Card
function GlowCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  function handleMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onMouseMove={handleMove} className="relative group">
      <div
        className="
          pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          [background:radial-gradient(250px_at_var(--x)_var(--y),rgba(139,92,246,0.15),transparent_70%)]
        "
      />
      {children}
    </div>
  );
}

export const ServiceSection = () => {
  /* Scroll Progress */
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();

  const { data, isLoading } = useGetAllServicesQuery(undefined);
  const services = data?.data || [];
  if (isLoading) {
    return <Loading />;
  }

  const handleService = () => {
    navigate("/services");
  };

  const handleServiceDetails = (id: string) => {
    navigate(`/service/${id}`);
    console.log("click", id);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed left-0 top-0 h-0.75 w-full origin-left bg-violet-500 z-50" />

      <section className="py-20">
        <div className=" mx-auto flex flex-col items-center gap-16 lg:px-16">
          {/* Header */}
          <div className="text-center max-w-3xl">
            <h2 className="mb-4 text-4xl font-semibold"> Services</h2>

            <p className="mb-12 w-10/12 mx-auto font-medium text-muted-foreground md:text-xl">
              Discover the latest trends, tips, and best practices in modern web development.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleService}
                className="w-6/12 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                Veiw All Services
              </Button>
            </motion.div>
          </div>

          {/* Cards */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {services.slice(0, 8).map((service: any) => (
              <motion.div key={service.id} whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 200 }}>
                <GlowCard>
                  <Card
                    className="group  flex h-full flex-col bg-primary/10 pt-0 rounded-2xl  overflow-hidden 
  transition-all duration-300 hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                  >
                    {/* IMAGE — fixed & equal for all */}
                    <div className="relative h-48 w-full overflow-hidden ">
                      <motion.img
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.4 }}
                        src={service?.picture}
                        alt={service?.name}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    </div>

                    {/* CONTENT — stretches automatically */}
                    <CardHeader className="flex-1 ">
                      <h3 className="text-md font-semibold leading-snug line-clamp-2 min-h-12">{service.name}</h3>
                    </CardHeader>

                    {/* FOOTER — always bottom aligned */}
                    <CardFooter className="mt-auto">
                      <Magnetic>
                        <Button
                          onClick={() => handleServiceDetails(service._id)}
                          className="flex items-center font-medium bg-linear-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          View Details
                          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Magnetic>
                    </CardFooter>
                  </Card>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
