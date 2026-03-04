import { HeroSection } from "@/components/modules/HomePage/HeroSection";
import { Community } from "@/components/modules/HomePage/Community";
import { Contact } from "./Contact";
import Client from "./Client";
import { ProjectSection } from "@/components/modules/HomePage/ProjectSection";
import { EmployeeSection } from "@/components/modules/HomePage/EmployeeSection";
import { ServiceSection } from "@/components/modules/HomePage/ServiceSection";

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <ServiceSection />
      <ProjectSection />
      <EmployeeSection />
      <Client />
      <Community />
      <Contact />
    </div>
  );
};

export default Homepage;
