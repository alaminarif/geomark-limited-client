import { useEffect, useRef, useState } from "react";
import { animate, motion, useAnimationFrame, useMotionValue, useMotionValueEvent } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewsCard from "@/components/news/NewsCard";

interface CommunityProps {
  className?: string;
  items: NewsItem[];
}

interface NewsItem {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  picture: string;
}

interface CardMeta {
  left: number;
  width: number;
}

const AUTO_SPEED = 65;
const controlButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-blue-400 bg-background/80 text-blue-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md dark:border-blue-400/40 dark:text-foreground/80 dark:hover:border-primary dark:hover:text-primary";
const indicatorButtonClassName =
  "h-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm";

const normalizeX = (value: number, width: number) => {
  if (!width) return 0;

  let next = value;

  while (next > 0) next -= width;
  while (next <= -width) next += width;

  return next;
};

export const NewsSection = ({ className, items }: CommunityProps) => {
  const x = useMotionValue(0);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const singleTrackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [trackWidth, setTrackWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [cardMeta, setCardMeta] = useState<CardMeta[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const shouldPause = isPaused || isInteracting || !!selectedNews;

  useEffect(() => {
    x.set(0);
  }, [items, x]);

  useEffect(() => {
    const measure = () => {
      const singleTrack = singleTrackRef.current;
      const viewport = viewportRef.current;

      if (!singleTrack || !viewport) return;

      setTrackWidth(singleTrack.scrollWidth);
      setViewportWidth(viewport.offsetWidth);

      const meta = cardRefs.current
        .slice(0, items.length)
        .map((el) => {
          if (!el) return null;
          return {
            left: el.offsetLeft,
            width: el.offsetWidth,
          };
        })
        .filter(Boolean) as CardMeta[];

      setCardMeta(meta);
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    if (singleTrackRef.current) resizeObserver.observe(singleTrackRef.current);
    if (viewportRef.current) resizeObserver.observe(viewportRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (shouldPause || !trackWidth) return;

    const moveBy = (AUTO_SPEED * delta) / 1000;
    const nextX = normalizeX(x.get() - moveBy, trackWidth);
    x.set(nextX);
  });

  useMotionValueEvent(x, "change", (latest) => {
    if (!trackWidth || !viewportWidth || !cardMeta.length) return;

    const normalized = Math.abs(normalizeX(latest, trackWidth));
    const rawCenter = normalized + viewportWidth / 2;
    const wrappedCenter = rawCenter % trackWidth;

    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    cardMeta.forEach((card, index) => {
      const center = card.left + card.width / 2;
      const distance = Math.abs(center - wrappedCenter);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });

    setActiveIndex(bestIndex);
  });

  const animateToX = (targetX: number) => {
    if (!trackWidth) return;

    animate(x, normalizeX(targetX, trackWidth), {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  const goToIndex = (index: number) => {
    if (!cardMeta[index] || !trackWidth || !viewportWidth) return;

    const card = cardMeta[index];
    const cardCenter = card.left + card.width / 2;
    const targetX = -(cardCenter - viewportWidth / 2);

    animateToX(targetX);
  };

  const goNext = () => {
    if (!items.length) return;
    goToIndex((activeIndex + 1) % items.length);
  };

  const goPrev = () => {
    if (!items.length) return;
    goToIndex((activeIndex - 1 + items.length) % items.length);
  };

  if (!items.length) return null;

  return (
    <>
      <section className={cn("relative overflow-hidden py-14 sm:py-16 lg:py-20", className)}>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <div>
                <h2 className="text-xl font-bold uppercase text-blue-800 dark:text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
                  News and Updates
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">Latest announcements and activities.</p>
              </div>
            </div>
          </motion.div>

          <div
            ref={viewportRef}
            className="relative overflow-hidden"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
          >
            <motion.div
              drag="x"
              dragElastic={0.04}
              dragMomentum={false}
              dragConstraints={{ left: -trackWidth, right: 0 }}
              onDragStart={() => setIsInteracting(true)}
              onDragEnd={() => {
                setIsInteracting(false);
                x.set(normalizeX(x.get(), trackWidth));
              }}
              style={{ x }}
              className="flex w-max select-none gap-4 will-change-transform sm:gap-5 lg:gap-6"
            >
              <div ref={singleTrackRef} className="flex gap-4 sm:gap-5 lg:gap-6">
                {items.map((item, index) => (
                  <NewsCard
                    key={`${item._id || item.id || item.name}-first-${index}`}
                    item={item}
                    index={index}
                    copy="first"
                    onOpen={setSelectedNews}
                    setCardRef={(el) => {
                      cardRefs.current[index] = el;
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-4 sm:gap-5 lg:gap-6" aria-hidden="true">
                {items.map((item, index) => (
                  <NewsCard
                    key={`${item._id || item.id || item.name}-second-${index}`}
                    item={item}
                    index={index}
                    copy="second"
                    onOpen={setSelectedNews}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:mt-8 sm:gap-5">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <motion.button
                type="button"
                onClick={goPrev}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(controlButtonClassName, "size-10 sm:size-11")}
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(controlButtonClassName, "h-10 min-w-28 gap-2 px-4 text-sm font-medium sm:h-11 sm:min-w-30 sm:px-5")}
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={goNext}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(controlButtonClassName, "size-10 sm:size-11")}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="flex max-w-full flex-wrap items-center justify-center gap-2 px-2">
              {items.map((_, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to news ${index + 1}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    indicatorButtonClassName,
                    activeIndex === index
                      ? "w-7 bg-blue-600 shadow-[0_6px_18px_rgba(37,47,126,0.25)] dark:bg-blue-400 sm:w-8"
                      : "w-2.5 bg-muted-foreground/30 hover:bg-primary/55 dark:bg-blue-300/25 dark:hover:bg-blue-300/50",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DialogContent className="max-h-[90vh] overflow-hidden border-blue-300/60 bg-background p-0 sm:max-w-3xl dark:border-violet-300/40">
          {selectedNews && (
            <div className="flex max-h-[90vh] flex-col overflow-hidden">
              <div className="h-56 w-full overflow-hidden bg-muted sm:h-72 md:h-80">
                <img src={selectedNews.picture} alt={selectedNews.name} className="block h-full w-full object-cover" />
              </div>

              <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <DialogHeader className="space-y-3 text-left">
                  <DialogTitle className="text-xl font-bold text-foreground sm:text-2xl">{selectedNews.name}</DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                  <p className="whitespace-pre-line text-justify text-sm leading-7 text-muted-foreground sm:text-base">{selectedNews.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
