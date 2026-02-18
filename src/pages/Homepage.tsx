import Project from "./Project";
import Service from "./Service";
import Client from "./Client";

const Homepage = () => {
  return (
    <div>
      This is the homepage. You can add your content here.
      <Service />
      <Project />
      <Client />
    </div>
  );
};

export default Homepage;
