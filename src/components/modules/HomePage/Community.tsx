import { Facebook, Github, Linkedin, Twitter } from "lucide-react";

import { cn } from "@/lib/utils";
// import { FaDiscord, FaGithub, FaLinkedin, FaXTwitter } from "react-icons";
interface Community2Props {
  className?: string;
}
export const Community = ({ className }: Community2Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <h2 className="mb-5 text-2xl text-center font-semibold md:text-3xl">Be part of our network</h2>
        <p className="font-medium text-center text-muted-foreground md:text-xl">Connect with others, share experiences, and stay in the loop.</p>
        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <a className="group  rounded-md border border-border p-6" href="#">
            <div className="flex items-center justify-center">
              <Twitter className="size-14" />
              {/* <ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" /> */}
            </div>
            <div className="mt-4 text-center">
              <h3 className="mb-1 text-2xl font-bold">Twitter</h3>
              <p className="text-md text-muted-foreground">Follow our latest updates and announcements.</p>
            </div>
          </a>
          <a className="group rounded-md border border-border p-6" href="#">
            <div className="flex items-center justify-center">
              <Linkedin className="size-14" />
              {/* <ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" /> */}
            </div>
            <div className="mt-4 text-center">
              <h3 className="mb-1 text-2xl font-bold">LinkedIn</h3>
              <p className="text-md text-muted-foreground">Connect with us and explore career opportunities.</p>
            </div>
          </a>
          <a className="group rounded-md border border-border p-6" href="#">
            <div className="flex items-center justify-center">
              <Github className="size-14" />
              {/* <ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" /> */}
            </div>
            <div className="mt-4 text-center">
              <h3 className="mb-1 text-2xl font-bold">Github</h3>
              <p className="text-md text-muted-foreground">Contribute to our open-source projects.</p>
            </div>
          </a>
          <a className="group rounded-md border border-border p-6" href="#">
            <div className="flex items-center justify-center">
              <Facebook className="size-14" />
              {/* <ArrowUpRight className="size-4 -translate-x-2 translate-y-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" /> */}
            </div>
            <div className="mt-4 text-center">
              <h3 className="mb-1 text-2xl font-bold">Facebook</h3>
              <p className="text-md text-muted-foreground">Join our Facebook community and stay updated.</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
