/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layout/Loading";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
// import { useNavigate } from "react-router";

const ProjectPage = () => {
  // const Navigate = useNavigate();

  const { data: projects } = useGetAllProjectsQuery(undefined);
  const { data, isLoading } = useGetAllServicesQuery(undefined);
  const services = data?.data || [];

  if (isLoading) return <Loading />;
  return (
    <section className="container mx-auto">
      <div></div>
    </section>
  );
};

export default ProjectPage;
