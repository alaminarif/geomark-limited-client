import Project from "./Project";
import Service from "./Service";
import Client from "./Client";
import Employee from "./Employee";
import { HeroSection } from "@/components/modules/HomePage/HeroSection";

const Homepage = () => {
  return (
    <div>
      <HeroSection />
      <Service />
      <Project />
      <Client />
      <Employee />
    </div>
  );
};

export default Homepage;
