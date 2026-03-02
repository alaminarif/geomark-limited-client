import { HeroSection } from "@/components/modules/HomePage/HeroSection";
import { Community } from "@/components/modules/HomePage/Community";
import { Contact } from "./Contact";
import Client from "./Client";
import Service from "./Service";
import { ProjectSection } from "@/components/modules/HomePage/ProjectSection";
import { EmployeeSection } from "@/components/modules/HomePage/EmployeeSection";

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <Service />
      <ProjectSection />
      <EmployeeSection />
      <Client />
      <Community />
      <Contact />
    </div>
  );
};

export default Homepage;
