import { useCallback, useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";

type ProjectSlideSectionProps = {
  projectId?: string;
  projectName: string;
  projectDescription?: string;
  projectStatus?: string;
  projectPeriod?: string;
  gallery?: string[];
};

type SlideItem = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

const FALLBACK_SLIDES = [
  "https://picsum.photos/seed/geomark-1/1600/900",
  "https://picsum.photos/seed/geomark-2/1600/900",
  "https://picsum.photos/seed/geomark-3/1600/900",
  "https://picsum.photos/seed/geomark-4/1600/900",
  "https://picsum.photos/seed/geomark-5/1600/900",
];

const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function ProjectSlideSection({
  projectId,
  projectName,
  projectDescription,
  projectStatus,
  projectPeriod,
  gallery,
}: ProjectSlideSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  const slideSources = gallery && gallery.length > 0 ? gallery : FALLBACK_SLIDES;

  const slideItems: SlideItem[] = useMemo(
    () =>
      slideSources.map((image, index) => ({
        id: `${projectId ?? "project"}-${index}`,
        image,
        eyebrow: projectStatus || (index === 0 ? "Featured View" : `Gallery View ${index + 1}`),
        title: projectName || "Project Showcase",
        subtitle:
          projectPeriod ||
          (index === 0
            ? projectDescription || "A closer look at this featured project."
            : `Visual overview of ${projectName || "the project"} in slide ${index + 1}.`),
      })),
    [projectDescription, projectId, projectName, projectPeriod, projectStatus, slideSources],
  );

  const slideCount = slideItems.length;
  const safeCurrent = slideCount > 0 ? Math.min(current, slideCount - 1) : 0;
  const currentSlide = slideItems[safeCurrent];

  const handlePrev = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrent((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  }, [slideCount]);

  const handleNext = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrent((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  }, [slideCount]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      const isTyping = tagName === "input" || tagName === "textarea" || tagName === "select" || target?.isContentEditable;

      if (isTyping) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <motion.div variants={scaleIn} className="mx-auto w-full max-w-5xl space-y-4">
      <div className="relative overflow-hidden rounded-3xl border bg-background shadow-2xl">
        <div className="relative aspect-2/1 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide?.id}
              src={currentSlide?.image}
              alt={currentSlide?.title || `Project slide ${safeCurrent + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(10px)" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: "blur(12px)" }}
              transition={{
                duration: shouldReduceMotion ? 0.25 : 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`overlay-${currentSlide?.id}`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{
                  duration: shouldReduceMotion ? 0.2 : 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-3xl"
              >
                <span className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-white/85 backdrop-blur-md">
                  {currentSlide?.eyebrow}
                </span>

                <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-white md:text-2xl lg:text-3xl">{currentSlide?.title}</h3>

                {currentSlide?.subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 md:text-base">{currentSlide.subtitle}</p>}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs text-white backdrop-blur-md md:text-sm">
            {String(safeCurrent + 1).padStart(2, "0")} / {String(slideItems.length).padStart(2, "0")}
          </div>

          <div className="absolute right-4 top-4 z-10 hidden rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs text-white/85 backdrop-blur-md md:block">
            Use ← → keys
          </div>

          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3">
            <Button
              type="button"
              onClick={handlePrev}
              variant="outline"
              className="h-11 w-11 rounded-full border-white/20 bg-black/35 p-0 text-white backdrop-blur-md hover:bg-black/50"
            >
              ←
            </Button>
          </div>

          <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-3">
            <Button
              type="button"
              onClick={handleNext}
              variant="outline"
              className="h-11 w-11 rounded-full border-white/20 bg-black/35 p-0 text-white backdrop-blur-md hover:bg-black/50"
            >
              →
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {slideItems.map((slide, index) => {
          const isActive = safeCurrent === index;

          return (
            <motion.button
              key={slide.id}
              type="button"
              onClick={() => setCurrent(index)}
              whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={[
                "group relative h-20 w-28 overflow-hidden rounded-xl border transition-all duration-300",
                isActive ? "border-purple-500 shadow-lg shadow-purple-500/30 ring-2 ring-purple-500/40" : "border-border opacity-80 hover:opacity-100",
              ].join(" ")}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? "true" : "false"}
            >
              <img
                src={slide.image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className={["absolute inset-0 transition-all duration-300", isActive ? "bg-transparent" : "bg-black/25"].join(" ")} />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
