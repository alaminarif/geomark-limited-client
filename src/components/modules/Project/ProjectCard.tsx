/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowBigRight } from "lucide-react";

type Props = {
  item: any;
  onView: (id: string) => void;
};

const ProjectCard = ({ item, onView }: Props) => {
  const isOngoing = item?.status === "ONGOING";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group border border-muted rounded-2xl bg-background/40 overflow-hidden"
    >
      <div className="relative">
        {/* Image with zoom on hover */}
        <motion.img
          src={item?.picture}
          alt={item?.name}
          className="w-full h-40 object-cover shrink-0"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />

        {/* Subtle overlay on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-t from-black/40 via-black/0 to-black/0" />

        {/* Status badge */}
        <motion.p
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-1 rounded-md backdrop-blur bg-black/30 ${
            isOngoing ? "text-destructive" : "text-white"
          }`}
          animate={isOngoing ? { scale: [1, 1.08, 1], opacity: [1, 0.85, 1] } : { opacity: 1 }}
          transition={isOngoing ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : undefined}
        >
          {item?.status || "-"}
        </motion.p>

        <div className="flex-1 min-w-0 p-3">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 whitespace-normal wrap-break-word">{item?.name}</h3>

          <div className="mt-2 text-sm text-muted-foreground space-y-1">
            <div className="flex w-full items-center justify-between">
              {/* calendar + date */}
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-calendar-1 text-purple-500"
                >
                  <path d="M11 14h1v4" />
                  <path d="M16 2v4" />
                  <path d="M3 10h18" />
                  <path d="M8 2v4" />
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                </svg>

                <span>{item?.year ? item.year : "-"}</span>
              </span>

              {/*  client name */}
              <span className="flex items-center ml-6 gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-user text-purple-500"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>

                <span className="line-clamp-1">{item?.client || "-"}</span>
              </span>
            </div>
          </div>

          <div className="mt-4 ">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => onView(item?._id)} className="w-full bg-linear-to-r from-purple-500 to-blue-500">
                View{" "}
                <span>
                  {" "}
                  <ArrowBigRight />
                </span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Glow ring on hover */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-transparent group-hover:ring-purple-500/40 transition duration-300" />
      </div>
    </motion.div>
  );
};

export default ProjectCard;
