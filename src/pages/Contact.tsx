import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Contact = ({ className }: { className?: string }) => {
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className={cn("relative overflow-hidden text-white py-16 sm:py-20 lg:py-28", className)}>
      <div className="absolute inset-0 web3-gradient" />

      {/* 🌈 blobs */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -60, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-40 -left-40 h-112 w-md rounded-full bg-purple-500/20 blur-[140px]"
      />

      <motion.div
        aria-hidden
        animate={{ y: [0, 60, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-40 -right-40 h-128 w-lg rounded-full bg-blue-500/20 blur-[160px]"
      />

      {/* ✅ OUTER CONTAINER (gives side padding always) */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* ✅ INNER MAX WIDTH (prevents over-stretch on 1536+) */}
        <div className="mx-auto w-full max-w-350 2xl:max-w-375">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] xl:gap-20"
          >
            {/* LEFT */}
            <motion.div variants={item} className="max-w-xl space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold">Contact Us</h1>

              <p className="text-gray-300">We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!</p>

              <div className="space-y-3 text-gray-200">
                <p>
                  <span className="font-semibold text-white">Address:</span> House 33, Road 12, Pisciculture Housing Society, Mohammadpur, Dhaka,
                  Bangladesh
                </p>

                <p>
                  <span className="font-semibold text-white">Phone:</span> 01943223060
                </p>

                <p>
                  <span className="font-semibold text-white">Email:</span> geomarkbd@gmail.com
                </p>

                <p>
                  <span className="font-semibold text-white">Web:</span>{" "}
                  <a href="https://geomarkbd.com" target="_blank" className="underline hover:text-blue-400">
                    Visit Website
                  </a>
                </p>
              </div>
            </motion.div>

            {/* FORM */}
            <motion.div
              variants={item}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10 shadow-2xl"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label>First Name</Label>
                  <Input className="bg-white/5 border-white/20 focus-visible:border-blue-500" />
                </div>

                <div className="grid gap-1.5">
                  <Label>Last Name</Label>
                  <Input className="bg-white/5 border-white/20 focus-visible:border-blue-500" />
                </div>
              </div>

              <div className="grid gap-1.5 mt-5">
                <Label>Email</Label>
                <Input className="bg-white/5 border-white/20 focus-visible:border-blue-500" />
              </div>

              <div className="grid gap-1.5 mt-5">
                <Label>Subject</Label>
                <Input className="bg-white/5 border-white/20 focus-visible:border-blue-500" />
              </div>

              <div className="grid gap-1.5 mt-5">
                <Label>Message</Label>
                <Textarea className="min-h-35 bg-white/5 border-white/20 focus-visible:border-blue-500" />
              </div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="mt-6">
                <Button className="w-full rounded-xl bg-linear-to-r from-purple-500 to-blue-500">Send Message</Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
