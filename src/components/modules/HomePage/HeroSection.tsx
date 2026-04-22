/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import HeroOne from "@/assets/images/DEM-scaled.jpg";
import HeroTwo from "@/assets/images/IMG_20161017_232258-scaled.jpg";
import HeroThree from "@/assets/images/IMG_20170217_163330-scaled.jpg";

const heroControlClassName =
  "inline-flex size-11 items-center justify-center rounded-full border border-blue-400  text-blue-600 shadow-lg bg-white/60 transition-all duration-300 hover:border-primary hover:bg-black/45 hover:text-primary hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] dark:border-blue-400/40 dark:text-foreground/80 dark:hover:border-primary dark:hover:text-primary";

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
      title: "GIS, Surveying and Planning Consultancy",
      subtitle: "Geospatial services for infrastructure, land and development projects.",
      button: "Start Journey",
    },
    {
      image: HeroTwo,
      title: "Digital Mapping and Remote Sensing",
      subtitle: "Mapping, CAD, GIS and survey data solutions for Bangladesh.",
      button: "Discover More",
    },
    {
      image: HeroThree,
      title: "Engineering and IT Enabled Services",
      subtitle: "Planning, design, supervision and software support from one team.",
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    setMousePosition({
      x: (clientX / window.innerWidth - 0.5) * 20,
      y: (clientY / window.innerHeight - 0.5) * 20,
    });
  };

  const handlePrev = () => {
    emblaApi?.scrollPrev();
  };

  const handleNext = () => {
    emblaApi?.scrollNext();
  };

  return (
    <Carousel plugins={[autoplay]} setApi={setEmblaApi} opts={{ loop: true }} className="w-full">
      <CarouselContent>
        {slides.map((slide, index) => {
          const isActive = currentIndex === index;

          return (
            <CarouselItem key={slide.title} className="basis-full">
              <div
                onMouseMove={handleMouseMove}
                className="relative flex h-[calc(100vh-100px)] min-h-128 w-full flex-col justify-end overflow-hidden"
              >
                {/* Background Image */}
                <motion.img
                  key={isActive ? `hero-image-${currentIndex}` : `hero-image-idle-${index}`}
                  src={slide.image}
                  alt={slide.title}
                  initial={isActive ? { opacity: 0.88, scale: 1.03 } : false}
                  animate={{
                    opacity: isActive ? 1 : 0.92,
                    scale: isActive ? [1.03, 1.16] : 1.05,
                    x: isActive ? mousePosition.x : 0,
                    y: isActive ? mousePosition.y : 0,
                  }}
                  transition={{
                    opacity: { duration: 0.7, ease: "easeOut" },
                    scale: { duration: 6.8, ease: "linear" },
                    x: { duration: 0.45, ease: "easeOut" },
                    y: { duration: 0.45, ease: "easeOut" },
                  }}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />

                {/* Animated Light Overlay */}
                <motion.div
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/40 to-black/80"
                />

                {/* Slide Title */}
                <div className="relative z-10 px-4 pb-6">
                  <motion.h2
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0.92,
                      y: isActive ? 0 : 10,
                    }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="w-fit rounded-md bg-black/25 px-4 py-2 text-2xl font-bold tracking-wide backdrop-blur-md sm:text-2xl md:text-2xl"
                  >
                    {slide.title.split(" ").map((word, i) => (
                      <motion.span
                        key={`${slide.title}-${i}`}
                        className="mr-3 inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: isActive ? i * 0.06 : 0 }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h2>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <motion.button
        type="button"
        onClick={handlePrev}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`absolute left-4 top-1/2 z-20 -translate-y-1/2 sm:left-6 ${heroControlClassName}`}
        aria-label="Previous hero slide"
      >
        <ArrowLeft className="size-5  " />
      </motion.button>

      <motion.button
        type="button"
        onClick={handleNext}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`absolute right-4 top-1/2 z-20 -translate-y-1/2 sm:right-6 ${heroControlClassName}`}
        aria-label="Next hero slide"
      >
        <ArrowRight className="size-5" />
      </motion.button>
    </Carousel>
  );
}
