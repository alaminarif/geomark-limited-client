import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Contact = ({ className }: { className?: string }) => {
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className={cn(" mx-auto relative py-32 overflow-hidden web3-gradient text-white", className)}>
      {/* Floating Animated Blobs */}
      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-600 opacity-30 blur-[150px]"
      />

      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500 opacity-30 blur-[150px]"
      />

      <div className="container relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto flex max-w-6xl flex-col gap-16 lg:flex-row"
        >
          {/* LEFT SIDE */}
          <motion.div variants={item} className="max-w-md space-y-6">
            <div>
              <h1 className="text-5xl font-bold leading-tight">Contact Us</h1>
              <p className="text-gray-300">We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!</p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Address: House 33 ,Road 12, Pisciculture Housing Society, Mohammadpur., Dhaka, Bangladesh</span>
              </p>
              <p className="py-2">
                <span className="font-semibold">Phone: 01943223060 </span>
              </p>
              <p>
                <span className="font-bold">Email: geomarkbd@gmail.com </span>
                <a href="mailto:geomarkbd@gmail.com" className="underline"></a>
              </p>
              <p className="pt-2">
                <span className="font-bold">Web: </span>
                <a href="https://geomarkbd.com" target="_blank" className="underline">
                  Visit Website
                </a>
              </p>
            </div>
          </motion.div>

          {/* GLASS FORM */}
          <motion.div
            variants={item}
            whileHover={{ y: -5 }}
            className="flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-white/20 bg-white/10 p-10 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" className="glow-input bg-white/5 border-white/20" placeholder="First Name" />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" className="glow-input bg-white/5 border-white/20" placeholder="Last Name" />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="glow-input bg-white/5 border-white/20" placeholder="Email" />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" className="glow-input bg-white/5 border-white/20" placeholder="Subject" />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" className="glow-input bg-white/5 border-white/20" placeholder="Tell us about your idea..." />
            </div>

            {/* Magnetic Animated Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                Send Message
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
