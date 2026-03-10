import Loading from "@/components/layout/Loading";
// import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatus } from "@/constants/project";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { useSearchParams } from "react-router";

const ProjectFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: projects } = useGetAllProjectsQuery(undefined);
  const { data: services, isLoading } = useGetAllServicesQuery(undefined);

  const seletedService = searchParams.get("title") || undefined;
  const seletedYear = searchParams.get("year") || undefined;
  const seletedStatus = searchParams.get("status") || undefined;

  const serviceOptions = services?.data?.map((item: { _id: string; name: string }) => ({
    label: item.name,
    value: item._id,
  }));

  const projectYearOptions = [...new Set(((projects?.data ?? []) as { _id: string; year: string }[]).map((item) => item.year))]
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({
      label: year,
      value: year,
    }));

  const projectStatusOptions = ProjectStatus.map((item: { label: string; value: string }) => ({
    label: item.label,
    value: item.value,
  }));

  const handleServiceChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("title", value);
    setSearchParams(params);
    console.log(value);
  };

  const handleProjectYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("year", value);
    setSearchParams(params);
    console.log(value);
  };

  const handleProjectStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", value);
    setSearchParams(params);
    console.log(value);
  };

  const handleClearFilterYear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("year");
    setSearchParams(params);
  };

  const handleClearFilterStatus = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("status");
    setSearchParams(params);
  };

  const handleClearFilterSector = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("title");
    setSearchParams(params);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-bold">Project Filters</h1>
        {/* <Button size="sm" variant="outline" className="text-destructive" onClick={handleClearFilter}>
          Clear Filter
        </Button> */}
      </div>

      <div className=" grid  grid-cols-12 gap-12  lg:gap-16 mx-auto">
        <div className="col-span-9 sm:col-span-6 md:col-span-6 lg:col-span-4 ">
          <Select
            onValueChange={(val) => {
              if (val === "__all__") {
                handleClearFilterSector();
                return;
              }
              handleServiceChange(val);
            }}
            value={seletedService ? seletedService : ""}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full ">
              <SelectValue placeholder="All Sector" />
            </SelectTrigger>
            <SelectContent className="bg-linear-to-br from-primary/10 via-transparent to-purple-500/10">
              <SelectGroup>
                <SelectItem value="__all__" className="text-white border-2 mb-2">
                  All Sector
                </SelectItem>
                {serviceOptions?.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.label} className="text-white   border-2 mb-2">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-9 sm:col-span-6 md:col-span-6 lg:col-span-4 ">
          <Select
            onValueChange={(val) => {
              if (val === "__all__") {
                handleClearFilterYear();
                return;
              }
              handleProjectYearChange(val);
            }}
            value={seletedYear ? seletedYear : ""}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full ">
              <SelectValue placeholder="All Year" />
            </SelectTrigger>
            <SelectContent className="bg-linear-to-br from-primary/10 via-transparent to-purple-500/10">
              <SelectGroup>
                <SelectItem value="__all__" className="text-white border-2 mb-2">
                  All Year
                </SelectItem>
                {projectYearOptions?.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.label} className="text-white   border-2 mb-2">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-9 sm:col-span-6 md:col-span-6 lg:col-span-4 ">
          <Select
            onValueChange={(val) => {
              if (val === "__all__") {
                handleClearFilterStatus();
                return;
              }
              handleProjectStatusChange(val);
            }}
            value={seletedStatus ? seletedStatus : ""}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-linear-to-br from-primary/10 via-transparent to-purple-500/10">
              <SelectGroup>
                <SelectItem value="__all__" className="text-white border-2 mb-2">
                  All Status
                </SelectItem>
                {projectStatusOptions?.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.value} className="text-white   border-2 mb-2">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;
