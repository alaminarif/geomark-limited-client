import Project from "./Project";
import Service from "./Service";
import Client from "./Client";
import Employee from "./Employee";

const Homepage = () => {
  return (
    <div>
      This is the homepage. You can add your content here.
      <Service />
      <Project />
      <Client />
      <Employee />
    </div>
  );
};

export default Homepage;
