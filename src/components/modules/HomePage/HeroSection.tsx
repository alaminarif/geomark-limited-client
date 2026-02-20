/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import HeroOne from "@/assets/images/DEM-scaled.jpg";
import HeroTwo from "@/assets/images/IMG_20161017_232258-scaled.jpg";
import HeroThree from "@/assets/images/IMG_20170217_163330-scaled.jpg";

export function HeroSection() {
  const [emblaApi, setEmblaApi] = React.useState<any>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const autoplay = React.useMemo(
    () =>
      Autoplay({
        delay: 7000,
        stopOnInteraction: false,
      }),
    [],
  );

  const slides = [
    {
      image: HeroOne,
      title: "Beyond Digital Experience",
      subtitle: "Premium design engineered for performance.",
      button: "Start Journey",
    },
    {
      image: HeroTwo,
      title: "Engineered For Innovation",
      subtitle: "Crafting the future of web experience.",
      button: "Discover More",
    },
    {
      image: HeroThree,
      title: "Dominate The Future",
      subtitle: "Power. Precision. Perfection.",
      button: "Join Now",
    },
  ];

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const slide = slides[currentIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    setMousePosition({
      x: (clientX / window.innerWidth - 0.5) * 20,
      y: (clientY / window.innerHeight - 0.5) * 20,
    });
  };

  return (
    <Carousel plugins={[autoplay]} setApi={setEmblaApi} opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {slides.map((_, index) => (
          <CarouselItem key={index} className="basis-full">
            <div onMouseMove={handleMouseMove} className="relative h-screen w-full overflow-hidden">
              {/* Cinematic Background */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.title}
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{
                    opacity: 1,
                    scale: 1.05,
                    x: mousePosition.x,
                    y: mousePosition.y,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Animated Light Overlay */}
              <motion.div
                animate={{ opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/40 to-black/80"
              />

              {/* Floating Particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -40, 0] }}
                    transition={{
                      duration: 6 + i,
                      repeat: Infinity,
                    }}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      visible: { transition: { staggerChildren: 0.08 } },
                    }}
                  >
                    {/* Word Reveal Title */}
                    <motion.h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-wide">
                      {slide.title.split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          className="inline-block mr-3"
                          variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      className="mt-6 text-lg md:text-2xl text-gray-200"
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      {slide.subtitle}
                    </motion.p>

                    {/* Glass CTA */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="mt-10 px-8 py-4 rounded-full backdrop-blur-md bg-white/10 border border-white/30 text-white font-semibold text-lg shadow-xl hover:bg-white/20"
                    >
                      {slide.button}
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
