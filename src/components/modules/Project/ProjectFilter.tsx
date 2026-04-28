import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectStatus } from "@/constants/project";
import { cn } from "@/lib/utils";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { BriefcaseBusiness, CalendarRange, CircleDot, ListFilter } from "lucide-react";
import { useSearchParams } from "react-router";

type FilterOption = {
  label: string;
  value: string;
};

const filterSelectTriggerClassName =
  "h-11 w-full rounded-xl border border-blue-300 bg-gradient-to-r from-purple-50 to-blue-50 text-slate-700 shadow-sm focus:ring-2 focus:ring-purple-300/40 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 dark:text-foreground";
const filterSelectContentClassName =
  "max-h-80 w-[var(--radix-select-trigger-width)] rounded-2xl border-blue-200 bg-white p-2 text-slate-700 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-foreground";
const filterSelectItemClassName =
  "mb-1 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:bg-blue-50 focus:text-blue-700 dark:text-foreground dark:focus:bg-slate-800 dark:focus:text-blue-200";
const filterSelectMarkerClassName =
  "flex size-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-200";

const getStatusMarkerClassName = (status: string) => {
  const value = status.trim().toUpperCase();

  if (value === "COMPLETED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300";
  }

  if (value === "ONGOING") {
    return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300";
  }

  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300";
};

const ProjectFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: projects } = useGetAllProjectsQuery(undefined);
  const { data: services, isLoading } = useGetAllServicesQuery(undefined);

  const selectedService = searchParams.get("service") || "";
  const selectedYear = searchParams.get("year") || "";
  const selectedStatus = searchParams.get("status") || "";

  const serviceOptions =
    services?.data
      ?.map((item: { _id: string; name: string }) => ({
        label: item.name,
        value: item._id,
      }))
      .sort((a: FilterOption, b: FilterOption) => a.label.localeCompare(b.label, undefined, { sensitivity: "base", numeric: true })) || [];

  const projectYearOptions = [...new Set(((projects?.data ?? []) as { _id: string; year: string }[]).map((item) => item.year))]
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({
      label: year,
      value: year,
    }));

  const projectStatusOptions: FilterOption[] = ProjectStatus.map((item: { label: string; value: string }) => ({
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="min-w-0">
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
            <SelectTrigger className={cn(filterSelectTriggerClassName, "min-w-0 overflow-hidden text-left")}>
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent className={filterSelectContentClassName} position="popper" align="start">
              <SelectItem value="__all__" className={filterSelectItemClassName}>
                <span className="flex min-w-0 items-center gap-2">
                  <span className={filterSelectMarkerClassName}>
                    <ListFilter className="size-4" />
                  </span>
                  <span className="min-w-0 whitespace-normal break-words leading-snug">All Services</span>
                </span>
              </SelectItem>

              {serviceOptions.map((item: FilterOption) => (
                <SelectItem key={item.value} value={item.value} className={filterSelectItemClassName}>
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={filterSelectMarkerClassName}>
                      <BriefcaseBusiness className="size-4" />
                    </span>
                    <span className="min-w-0 whitespace-normal break-words leading-snug">{item.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0">
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
            <SelectTrigger className={cn(filterSelectTriggerClassName, "min-w-0 overflow-hidden text-left")}>
              <SelectValue placeholder="All Year" />
            </SelectTrigger>
            <SelectContent className={filterSelectContentClassName} position="popper" align="start">
              <SelectItem value="__all__" className={filterSelectItemClassName}>
                <span className="flex min-w-0 items-center gap-2">
                  <span className={filterSelectMarkerClassName}>
                    <ListFilter className="size-4" />
                  </span>
                  <span className="min-w-0 whitespace-normal break-words leading-snug">All Year</span>
                </span>
              </SelectItem>

              {projectYearOptions.map((item: FilterOption) => (
                <SelectItem key={item.value} value={item.value} className={filterSelectItemClassName}>
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={filterSelectMarkerClassName}>
                      <CalendarRange className="size-4" />
                    </span>
                    <span className="min-w-0 whitespace-normal break-words leading-snug">{item.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0">
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
            <SelectTrigger className={cn(filterSelectTriggerClassName, "min-w-0 overflow-hidden text-left")}>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className={filterSelectContentClassName} position="popper" align="start">
              <SelectItem value="__all__" className={filterSelectItemClassName}>
                <span className="flex min-w-0 items-center gap-2">
                  <span className={filterSelectMarkerClassName}>
                    <ListFilter className="size-4" />
                  </span>
                  <span className="min-w-0 whitespace-normal break-words leading-snug">All Status</span>
                </span>
              </SelectItem>

              {projectStatusOptions.map((item: FilterOption) => (
                <SelectItem key={item.value} value={item.value} className={filterSelectItemClassName}>
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={cn(filterSelectMarkerClassName, getStatusMarkerClassName(item.value))}>
                      <CircleDot className="size-4" />
                    </span>
                    <span className="min-w-0 whitespace-normal break-words leading-snug">{item.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;
