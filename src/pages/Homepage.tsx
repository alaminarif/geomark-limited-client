import Project from "./Project";
import Service from "./Service";
import Client from "./Client";
import Employee from "./Employee";
import { HeroSection } from "@/components/modules/HomePage/HeroSection";
import { Community } from "@/components/modules/HomePage/Community";

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <Service />
      <Project />
      <Client />
      <Employee />
      <Community />
    </div>
  );
};

export default Homepage;
