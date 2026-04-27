/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import HeroOne from "@/assets/images/Urban Planning & Designing Hero.png";

import HeroTwo from "@/assets/images/GIS Mapping, Remote Sensing & Photogrammetry Hero.png";

import HeroThree from "@/assets/images/Advanced Topographic Surveying Hero.png";
import HeroFour from "@/assets/images/Cadastral Mapping Hero.png";
import HeroFive from "@/assets/images/Socioeconomic And Other Related Survey Hero.png";
import HeroSix from "@/assets/images/Transportation Survey and Planning Hero.png";
import HeroSeven from "@/assets/images/Environmental Impact Assessment (EIA) Hero.png";
import HeroEight from "@/assets/images/Aerial Survey; Drone Data Collection, Photogrammetry with Lidar Hero.png";
import HeroNine from "@/assets/images/Social Impact Assessment (SIA), Land Acquisition Plan (LAP), Resettlement Action Plan (RAP) Hero.png";
import HeroTen from "@/assets/images/Feasibility Study and Consultancy Hero.png";



const heroControlClassName =
  "inline-flex size-11 items-center justify-center rounded-full border border-blue-400  text-blue-600 shadow-lg bg-white/60 transition-all duration-300 hover:border-primary hover:bg-black/45 hover:text-primary hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] dark:border-blue-400/40 dark:text-foreground/80 dark:hover:border-primary dark:hover:text-primary";

export function HeroSection() {
  const [emblaApi, setEmblaApi] = React.useState<any>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

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
      title: "Urban Planning & Designing",
      subtitle: "Mapping, CAD, GIS and survey data solutions for Bangladesh.",
      button: "Discover More",
    },
    {
      image: HeroTwo,
      title: "GIS Mapping, Remote Sensing & Photogrammetry",
      subtitle: "Planning, design, supervision and software support from one team.",
      button: "Join Now",
    },
    {
      image: HeroThree,
      title: "Advanced Topographic Surveying",
      subtitle: "Planning, design, supervision and software support from one team.",
      button: "Join Now",
    },
    {
      image: HeroFour,
      title: "Cadastral Mapping",
      subtitle: "Planning, design, supervision and software support from one team.",
      button: "Join Now",
    },
    {
      image: HeroFive,
      title: "Socioeconomic And Other Related Survey",
      subtitle: "Planning, design, supervision and software support from one team.",
      button: "Join Now",
    },
    {
      image: HeroSix,
      title: "Transportation Survey and Planning",
      subtitle: "Planning, design, supervision and software support from one team.",
      button: "Join Now",
    },
    {
      image: HeroSeven,
      title: "Environmental Impact Assessment (EIA)",
      subtitle: "Planning, design, supervision and software support from one team.",
      button: "Join Now",
    },
    {
      image: HeroEight,
      title: "Aerial Survey; Drone Data Collection, Photogrammetry with Lidar",
      subtitle: "Planning, design, supervision and software support from one team.",
      button: "Join Now",
    },
    {
      image: HeroNine,
      title: "Social Impact Assessment (SIA), Land Acquisition Plan (LAP), Resettlement Action Plan (RAP)",
      subtitle: "Planning, design, supervision and software support from one team.",
      button: "Join Now",
    },
    {
      image: HeroTen,
      title: "Feasibility Study and Consultancy",
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
              <div className="relative flex h-[calc(100vh-100px)] min-h-128 w-full overflow-hidden">
                {/* Background Image */}
                <motion.img
                  key={isActive ? `hero-image-${currentIndex}` : `hero-image-idle-${index}`}
                  src={slide.image}
                  alt={slide.title}
                  initial={isActive ? { opacity: 0.88, scale: 1 } : false}
                  animate={{
                    opacity: isActive ? 1 : 0.92,
                    scale: 1,
                  }}
                  transition={{
                    opacity: { duration: 0.7, ease: "easeOut" },
                  }}
                  className="absolute inset-0 h-full w-full object-fill"
                />

                {/* Animated Light Overlay */}
                <motion.div
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/40 to-black/80"
                />

                {/* Slide Title */}
                {/* <div className="relative z-10 grid h-full w-full place-items-center">
                  <div className="mx-auto flex max-w-3xl items-center justify-center px-4 text-center">
                    <motion.h2
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0.92,
                        y: isActive ? 0 : 10,
                      }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="inline-block w-fit  rounded-md bg-black/15 px-3 py-1.5 text-center text-2xl font-bold leading-tight tracking-wide text-white backdrop-blur-sm sm:px-4 sm:text-3xl md:text-4xl"
                    >
                      {slide.title.split(" ").map((word, i) => (
                        <motion.span
                          key={`${slide.title}-${i}`}
                          className="mx-1 inline-block"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: isActive ? i * 0.06 : 0 }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.h2>
                  </div>
                </div> */}
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
