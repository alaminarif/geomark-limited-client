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
    <Carousel plugins={[autoplay]} setApi={setEmblaApi} opts={{ loop: true }} className="w-full min-h-[calc(100vh-100px)]">
      <CarouselContent>
        {slides.map((_, index) => (
          <CarouselItem key={index} className="basis-full">
            <div onMouseMove={handleMouseMove} className="relative min-h-[calc(100vh-60px)] w-full overflow-hidden flex flex-col justify-end">
              {/* Background Image */}
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
                className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/40 to-black/80"
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

              {/* Slide Title */}
              <div className="relative z-10 px-4 pb-6">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentIndex}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.8 }}
                    className="text-2xl sm:text-2xl md:text-2xl font-bold tracking-wide bg-black/25 backdrop-blur-md w-fit px-4 py-2 rounded-md"
                  >
                    {slide.title.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        className="inline-block mr-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>
                </AnimatePresence>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
