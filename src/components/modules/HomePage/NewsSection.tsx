import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useAnimationFrame, useMotionValue, useMotionValueEvent } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import Loading from "@/components/layout/Loading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetAllNewssQuery } from "@/redux/features/news/news.api";
import NewsCard from "@/components/news/NewsCard";

interface CommunityProps {
  className?: string;
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

const normalizeX = (value: number, width: number) => {
  if (!width) return 0;

  let next = value;

  while (next > 0) next -= width;
  while (next <= -width) next += width;

  return next;
};

export const NewsSection = ({ className }: CommunityProps) => {
  const { data, isLoading } = useGetAllNewssQuery(undefined);

  const items: NewsItem[] = useMemo(() => data?.data || [], [data]);

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

  if (isLoading) return <Loading />;
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
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goPrev}
                className="h-10 w-10 rounded-full border-blue-300/60 bg-background/80 text-blue-500 backdrop-blur-sm dark:border-violet-300/40 dark:text-foreground/80 sm:h-11 sm:w-11"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPaused((prev) => !prev)}
                className="min-w-28 rounded-full border-blue-300/60 bg-background/80 px-4 text-blue-500 backdrop-blur-sm dark:border-violet-300/40 dark:text-foreground/80 sm:min-w-30 sm:px-5"
              >
                {isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={goNext}
                className="h-10 w-10 rounded-full border-blue-300/60 bg-background/80 text-blue-500 backdrop-blur-sm dark:border-violet-300/40 dark:text-foreground/80 sm:h-11 sm:w-11"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex max-w-full flex-wrap items-center justify-center gap-2 px-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to news ${index + 1}`}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    activeIndex === index
                      ? "w-7 bg-blue-700 dark:bg-violet-300 sm:w-8"
                      : "w-2.5 bg-blue-300 hover:bg-blue-400 dark:bg-violet-300/30 dark:hover:bg-violet-300/50",
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
