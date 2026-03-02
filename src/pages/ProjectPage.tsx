/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layout/Loading";
import ProjectFilter from "@/components/modules/Project/ProjectFilter";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useSearchParams } from "react-router";

const ProjectPage = () => {
  // const Navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const service = searchParams.get("name") || undefined;

  const { data: projects, isLoading } = useGetAllProjectsQuery({ service });
  // const TServiceOtions =

  // console.log("servieOption", serviceOptions);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="container mx-auto">
      <div>
        <div className="">
          <ProjectFilter />
        </div>
        {projects?.data.map((project: any) => (
          <div className=" my-6">
            <p> {project.title}</p>
            <p>{project.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectPage;
