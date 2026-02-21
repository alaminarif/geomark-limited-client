/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useScroll } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import Loading from "@/components/layout/Loading";

/* ----------------------------------
   Magnetic Button Component
----------------------------------- */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    x.set(dx * 0.25);
    y.set(dy * 0.25);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={reset} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
}

/* ----------------------------------
   Hover-follow Glow Card
----------------------------------- */
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

/* ----------------------------------
   Main Section
----------------------------------- */
export const ServiceSection = () => {
  /* Scroll Progress */
  const { scrollYProgress } = useScroll();

  const { data, isLoading } = useGetAllServicesQuery(undefined);
  const services = data?.data || [];
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed left-0 top-0 h-0.75 w-full origin-left bg-violet-500 z-50" />

      <section className="py-20">
        <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
          {/* Header */}
          <div className="text-center max-w-3xl">
            <h2 className="mb-4 text-4xl font-semibold"> Services</h2>

            <p className="mb-12 w-10/12 mx-auto font-medium text-muted-foreground md:text-xl">
              Discover the latest trends, tips, and best practices in modern web development.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-6/12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                Veiw All Services
              </Button>
            </motion.div>
          </div>

          {/* Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service: any) => (
              <motion.div key={service.id} whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 200 }}>
                <GlowCard>
                  <Card
                    className="
                      overflow-hidden bg-transparent
                      transition-all duration-300
                      hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]
                    "
                  >
                    <div className="aspect-video overflow-hidden rounded-2xl">
                      <motion.img
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.4 }}
                        src={service?.picture}
                        alt={service.name}
                        className="h-full w-full aspect-video overflow-hidden rounded-3xl   object-cover px-4 "
                      />
                    </div>

                    <CardHeader>
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground">{service.description}</p>
                    </CardContent>

                    <CardFooter>
                      <Magnetic>
                        <a href={service.url} target="_blank" className="flex items-center font-medium">
                          View Details
                          <ArrowRight className="ml-2 size-4" />
                        </a>
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
