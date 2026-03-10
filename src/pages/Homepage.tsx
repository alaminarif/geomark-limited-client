import { HeroSection } from "@/components/modules/HomePage/HeroSection";
import { Community } from "@/components/modules/HomePage/Community";
import { Contact } from "./Contact";
import Client from "./Client";
import { ProjectSection } from "@/components/modules/HomePage/ProjectSection";
import { EmployeeSection } from "@/components/modules/HomePage/EmployeeSection";
import { ServiceSection } from "@/components/modules/HomePage/ServiceSection";
import { NewsSection } from "@/components/modules/HomePage/NewsSection";

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <NewsSection />
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
