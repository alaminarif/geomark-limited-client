import Loading from "@/components/layout/Loading";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { useSearchParams } from "react-router";

const ProjectFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: projects } = useGetAllProjectsQuery(undefined);
  const { data: services, isLoading } = useGetAllServicesQuery(undefined);

  const seletedService = searchParams.get("title") || undefined;

  const serviceOptions = services?.data?.map((item: { _id: string; name: string }) => ({
    label: item.name,
    value: item._id,
  }));

  // console.log(serviceOptions);

  const handleServiceChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("title", value);
    setSearchParams(params);
    console.log(value);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("title");
    // params.delete("tourType");
    setSearchParams(params);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="div">
        <div className="flex justify-between items-center my-4">
          <h1 className="text-xl font-bold">Project Filters</h1>
          <Button size="sm" variant="outline" onClick={handleClearFilter}>
            Clear Filter
          </Button>
        </div>

        <div className="div">
          <Select onValueChange={(label) => handleServiceChange(label)} value={seletedService ? seletedService : ""} disabled={isLoading}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select A Sector" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {serviceOptions?.map((item: { value: string; label: string }) => (
                  <SelectItem key={item.value} value={item.label} className="text-white">
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
