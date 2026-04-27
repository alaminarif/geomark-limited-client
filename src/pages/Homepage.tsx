import { HeroSection } from "@/components/modules/HomePage/HeroSection";
import { CommunitySection } from "@/components/modules/HomePage/CommunitySection";
import Loading from "@/components/layout/Loading";
import { Contact } from "./Contact";
import { ClientSection } from "@/components/modules/HomePage/ClientSection";
import { ProjectSection } from "@/components/modules/HomePage/ProjectSection";
import { EmployeeSection } from "@/components/modules/HomePage/EmployeeSection";
import { ServiceSection } from "@/components/modules/HomePage/ServiceSection";
import { NewsSection } from "@/components/modules/HomePage/NewsSection";
import { useGetClientsQuery } from "@/redux/features/client/client.api";
import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
import { useGetAllNewssQuery } from "@/redux/features/news/news.api";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";

const Homepage = () => {
  const { data: newsData, isLoading: newsLoading } = useGetAllNewssQuery(undefined);
  const { data: servicesData, isLoading: servicesLoading } = useGetAllServicesQuery({ limit: 8 });
  const { data: projectsData, isLoading: projectsLoading } = useGetAllProjectsQuery({ limit: 8 });
  const { data: employeesData, isLoading: employeesLoading } = useGetAllEmployeesQuery({ sort: "rank", limit: 8 });
  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery({ sort: "createdAt", limit: 12 });

  const isHomepageLoading = newsLoading || servicesLoading || projectsLoading || employeesLoading || clientsLoading;

  if (isHomepageLoading) {
    return (
      <div>
        <h1 className="sr-only">Geomark Limited GIS, surveying, digital mapping and planning consultancy in Bangladesh</h1>
        <HeroSection />
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <h1 className="sr-only">Geomark Limited GIS, surveying, digital mapping and planning consultancy in Bangladesh</h1>
      <HeroSection />
      <NewsSection items={newsData?.data || []} />
      <ServiceSection services={servicesData?.data || []} />
      <ProjectSection projects={projectsData?.data || []} />
      <EmployeeSection employees={employeesData?.data || []} />
      <ClientSection items={clientsData?.data || []} />
      <CommunitySection />
      <Contact />
    </div>
  );
};

export default Homepage;
