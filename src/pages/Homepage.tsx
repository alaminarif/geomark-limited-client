import Project from "./Project";
import Employee from "./Employee";
import { HeroSection } from "@/components/modules/HomePage/HeroSection";
import { Community } from "@/components/modules/HomePage/Community";
import { Contact } from "./Contact";
import Client from "./Client";
import { ServiceSection } from "@/components/modules/HomePage/ServiceSection";

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <ServiceSection />
      <Project />
      <Client />
      <Employee />
      <Community />
      <Contact />
    </div>
  );
};

export default Homepage;
