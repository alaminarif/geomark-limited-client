import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatus } from "@/constants/project";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { useSearchParams } from "react-router";

const ProjectFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: projects } = useGetAllProjectsQuery(undefined);
  const { data: services, isLoading } = useGetAllServicesQuery(undefined);

  const selectedService = searchParams.get("service") || "";
  const selectedYear = searchParams.get("year") || "";
  const selectedStatus = searchParams.get("status") || "";

  const serviceOptions =
    services?.data?.map((item: { _id: string; name: string }) => ({
      label: item.name,
      value: item._id,
    })) || [];

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
    params.set("service", value);
    setSearchParams(params);
  };

  const handleProjectYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("year", value);
    setSearchParams(params);
  };

  const handleProjectStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", value);
    setSearchParams(params);
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

  const handleClearFilterService = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("service");
    setSearchParams(params);
  };

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-bold text-blue-700 dark:text-foreground">Project Filters</h1>
      </div>

      <div className="grid grid-cols-12 gap-12 lg:gap-16 mx-auto">
        <div className="col-span-9 sm:col-span-6 md:col-span-6 lg:col-span-4">
          <Select
            onValueChange={(val) => {
              if (val === "__all__") {
                handleClearFilterService();
                return;
              }
              handleServiceChange(val);
            }}
            value={selectedService}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Service" />
            </SelectTrigger>
            <SelectContent className="bg-linear-to-br from-primary/10 via-transparent to-purple-500/10">
              <SelectGroup>
                <SelectItem value="__all__" className="text-muted-foreground border-2 mb-2">
                  All Service
                </SelectItem>

                {serviceOptions.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.value} className="text-foreground border-2 mb-2">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-9 sm:col-span-6 md:col-span-6 lg:col-span-4">
          <Select
            onValueChange={(val) => {
              if (val === "__all__") {
                handleClearFilterYear();
                return;
              }
              handleProjectYearChange(val);
            }}
            value={selectedYear}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Year" />
            </SelectTrigger>
            <SelectContent className="bg-linear-to-br from-primary/10 via-transparent to-purple-500/10">
              <SelectGroup>
                <SelectItem value="__all__" className="text-foreground border-2 mb-2">
                  All Year
                </SelectItem>

                {projectYearOptions.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.value} className="text-foreground border-2 mb-2">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-9 sm:col-span-6 md:col-span-6 lg:col-span-4">
          <Select
            onValueChange={(val) => {
              if (val === "__all__") {
                handleClearFilterStatus();
                return;
              }
              handleProjectStatusChange(val);
            }}
            value={selectedStatus}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-linear-to-br from-primary/10 via-transparent to-purple-500/10">
              <SelectGroup>
                <SelectItem value="__all__" className="text-muted-foreground border-2 mb-2">
                  All Status
                </SelectItem>

                {projectStatusOptions.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.value} className="text-foreground border-2 mb-2">
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
