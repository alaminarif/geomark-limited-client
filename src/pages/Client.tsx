// import { Facebook, Github, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Loading from "@/components/layout/Loading";
import { useGetClientsQuery } from "@/redux/features/client/client.api";

interface Community2Props {
  className?: string;
}

// const items = [
//   {
//     title: "LinkedIn",
//     desc: "Connect with us and explore career opportunities.",
//     icon: <Linkedin className="size-14" />,
//     link: "https://www.linkedin.com/company/geomark-limited-072025",
//   },
//   {
//     title: "Facebook",
//     desc: "Join our Facebook community and stay updated.",
//     icon: <Facebook className="size-14" />,
//     link: "https://www.facebook.com/profile.php?id=100063466780165",
//   },
//   {
//     title: "Twitter",
//     desc: "Follow our latest updates and announcements.",
//     icon: <Twitter className="size-14" />,
//     link: "https://twitter.com/geomarklimited",
//   },
//   {
//     title: "Github",
//     desc: "Contribute to our open-source projects.",
//     icon: <Github className="size-14" />,
//     link: "#",
//   },
// ];

// duplicate items for infinite effect

const Client = ({ className }: Community2Props) => {
  const { data, isLoading } = useGetClientsQuery(undefined);
  if (isLoading) return <Loading />;
  const items = data?.data || [];
  const loopItems = [...items, ...items];
  return (
    <section className={cn("relative py-20 overflow-hidden", className)}>
      <div className="container mx-auto">
        <h2 className="mb-5 text-center text-2xl font-bold md:text-3xl">CLIENTS</h2>
        <p className="mb-12 w-10/12 mx-auto font-medium text-muted-foreground md:text-xl">
          Geomark believes in a sustainable relationship with its clients . The team focuses on meeting the objectives of clients most efficiently and
          effectively with its available resources. Therefore, the number of clients has grown over the years since the birth of the organization. So
          far, it worked for and with government agencies, donor agencies, INGOs, local NGOs, and various academic and research institutions.
        </p>

        {/* Carousel Track */}
        <motion.div
          className="flex gap-6"
          animate={{
            x: ["3%", "-50%"],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
        >
          {loopItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                min-w-[80%]
                sm:min-w-[45%]
                md:min-w-[30%]
                lg:min-w-[22%]
                group relative rounded-xl 
                 p-6 backdrop-blur-lg
                transition-all duration-300
                hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]
              "
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />

              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-4">
                  <img src={item.picture} alt={item.name} className="size-28 object-contain" />
                </div>
                <h3 className="mb-1 text-2xl font-bold">{item.name}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Client;
