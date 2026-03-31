/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layout/Loading";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleImageUploader from "@/components/ui/MultipleImageUploader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { Textarea } from "@/components/ui/textarea";
import { ProjectStatus } from "@/constants/project";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useGetClientsQuery } from "@/redux/features/client/client.api";
import { useGetSingleProjectQuery, useUpdateProjectMutation } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarIcon, FolderPen, ImagePlus, Loader2, MapPin, Save, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const updateProjectSchema = z
  .object({
    title: z.string().min(1, "Service is required"),
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    objective: z.string().min(5, "Objective is required"),
    responsibility: z.string().min(5, "Responsibility is required"),
    status: z.string().min(1, "Status is required"),
    startDate: z
      .date({
        message: "Start date is required",
      })
      .optional(),
    endDate: z.date().optional().nullable(),
    location: z.string().min(2, "Location is required"),
    client: z.string().min(1, "Client is required"),
  })
  .refine(
    (data) => {
      if (!data.endDate || !data.startDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "End date cannot be earlier than start date",
      path: ["endDate"],
    },
  );

type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

const sectionClass =
  "rounded-3xl border border-purple-100 bg-white/90 p-5 shadow-[0_10px_30px_rgba(147,51,234,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_10px_30px_rgba(0,0,0,0.18)]";

const inputClass =
  "h-11 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 text-slate-700 placeholder:text-slate-400 focus-visible:border-purple-300 focus-visible:ring-2 focus-visible:ring-purple-300/40 dark:border-slate-700 dark:bg-slate-900 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:ring-indigo-500";

const textareaClass =
  "min-h-[110px] rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 text-slate-700 placeholder:text-slate-400 resize-none focus-visible:border-purple-300 focus-visible:ring-2 focus-visible:ring-purple-300/40 dark:border-slate-700 dark:bg-slate-900 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:ring-indigo-500";

const selectTriggerClass =
  "h-11 w-full rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 text-slate-700 focus:ring-2 focus:ring-purple-300/40 dark:border-slate-700 dark:bg-slate-900 dark:text-foreground";

const selectContentClass = "border-purple-100 bg-white text-slate-700 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-foreground";

const dateButtonClass =
  "h-11 justify-start rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 pl-3 text-left font-normal text-slate-700 hover:from-purple-100 hover:to-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-foreground dark:hover:bg-slate-800";

const popoverContentClass =
  "w-auto rounded-xl border border-purple-100 bg-white p-0 text-slate-700 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:text-foreground";

const uploadCardClass =
  "rounded-3xl border border-dashed border-purple-200 bg-gradient-to-br from-purple-50/80 to-blue-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/60";

const getIdValue = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?._id || value?.id || "";
};

const getImageUrl = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?.url || value?.secure_url || value?.path || "";
};

const ProjectUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);
  const initialDataRef = useRef<Record<string, any> | null>(null);

  const form = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      name: "",
      description: "",
      objective: "",
      responsibility: "",
      status: "",
      startDate: undefined,
      endDate: null,
      location: "",
      client: "",
    },
  });

  const { data: projectData, isLoading: projectLoading, isFetching: projectFetching } = useGetSingleProjectQuery(id, { skip: !id });

  const [updateProject, { isLoading: isSubmitting }] = useUpdateProjectMutation();
  const { data: servicesData, isLoading: servicesLoading } = useGetAllServicesQuery(undefined);
  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery(undefined);

  const project = projectData?.data;

  const serviceTitleOptions = useMemo(
    () =>
      servicesData?.data?.map((item: any) => ({
        value: item._id,
        label: item.name,
      })) || [],
    [servicesData],
  );

  const clientOptions = useMemo(
    () =>
      clientsData?.data?.map((item: any) => ({
        value: item._id,
        label: item.name,
      })) || [],
    [clientsData],
  );

  const projectStatusOptions = useMemo(
    () =>
      ProjectStatus.map((status) => ({
        value: status.value,
        label: status.label,
      })),
    [],
  );

  const existingThumbnail = useMemo(() => {
    return getImageUrl(project?.image) || getImageUrl(project?.thumbnail) || getImageUrl(project?.file) || "";
  }, [project]);

  const existingGallery = useMemo(() => {
    if (Array.isArray(project?.images)) return project.images.map(getImageUrl).filter(Boolean);
    if (Array.isArray(project?.files)) return project.files.map(getImageUrl).filter(Boolean);
    if (Array.isArray(project?.gallery)) return project.gallery.map(getImageUrl).filter(Boolean);
    return [];
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const formattedValues: UpdateProjectFormValues = {
      title: getIdValue(project?.title),
      name: project?.name || "",
      description: project?.description || "",
      objective: project?.objective || "",
      responsibility: project?.responsibility || "",
      status: project?.status || "",
      startDate: project?.startDate ? new Date(project.startDate) : undefined,
      endDate: project?.endDate ? new Date(project.endDate) : null,
      location: project?.location || "",
      client: getIdValue(project?.client),
    };

    form.reset(formattedValues);

    initialDataRef.current = {
      ...formattedValues,
      startDate: formattedValues.startDate ? formatISO(formattedValues.startDate) : null,
      endDate: formattedValues.endDate ? formatISO(formattedValues.endDate) : null,
    };
  }, [project, form]);

  const onSubmit = async (data: UpdateProjectFormValues) => {
    if (!id) {
      toast.error("Project ID not found");
      return;
    }

    const toastId = toast.loading("Updating project...");

    try {
      const normalizedData = {
        ...data,
        startDate: data.startDate ? formatISO(data.startDate) : null,
        endDate: data.endDate ? formatISO(data.endDate) : null,
      };

      const changedData: Record<string, any> = {};

      Object.entries(normalizedData).forEach(([key, value]) => {
        const oldValue = initialDataRef.current?.[key];

        if (oldValue !== value) {
          changedData[key] = value;
        }
      });

      const hasNewThumbnail = !!image;
      const hasNewGallery = images.some((item) => item instanceof File);

      if (Object.keys(changedData).length === 0 && !hasNewThumbnail && !hasNewGallery) {
        toast.info("No changes detected", { id: toastId });
        return;
      }

      const formData = new FormData();

      if (Object.keys(changedData).length > 0) {
        formData.append("data", JSON.stringify(changedData));
      }

      if (image) {
        formData.append("file", image);
      }

      images.forEach((item) => {
        if (item instanceof File) {
          formData.append("files", item);
        }
      });

      await updateProject({ id, data: formData }).unwrap();

      toast.success("Project updated successfully", { id: toastId });
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update project", { id: toastId });
      console.log(error);
    }
  };

  if (projectLoading || projectFetching || servicesLoading || clientsLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-7xl space-y-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-xl border-purple-200 bg-white text-slate-700 hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-300/80 via-violet-200/80 to-blue-300/80 p-5 shadow-md shadow-purple-200/50 dark:border-slate-800 dark:bg-gradient-to-r dark:from-violet-600/90 dark:via-indigo-600/90 dark:to-blue-600/90">
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Update Project</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-200">Edit project details, timeline, client information, and images.</p>
            </div>
          </div>

          <Button
            type="submit"
            form="update-project-form"
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-purple-300 via-violet-300 to-blue-300 text-slate-900 shadow-md shadow-purple-200/50 hover:opacity-95 dark:from-violet-600 dark:via-indigo-600 dark:to-blue-600 dark:text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Form {...form}>
          <form id="update-project-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className={sectionClass}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-purple-100 p-2.5 text-purple-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <FolderPen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-foreground">Project Information</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update the basic information about the project</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-foreground">Service</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentClass}>
                          {serviceTitleOptions.map((item: { label: string; value: string }) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-foreground">Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentClass}>
                          {projectStatusOptions.map((item: { label: string; value: string }) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-foreground">Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter project name" className={inputClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-foreground">Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write a short project description" className={textareaClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-foreground">Objective</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Project objective"
                          className="min-h-[100px] rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 text-slate-700 placeholder:text-slate-400 resize-none focus-visible:border-purple-300 focus-visible:ring-2 focus-visible:ring-purple-300/40 dark:border-slate-700 dark:bg-slate-900 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:ring-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responsibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-foreground">Responsibility</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Scope of responsibility"
                          className="min-h-[100px] rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 text-slate-700 placeholder:text-slate-400 resize-none focus-visible:border-purple-300 focus-visible:ring-2 focus-visible:ring-purple-300/40 dark:border-slate-700 dark:bg-slate-900 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:ring-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className={sectionClass}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-foreground">Timeline & Client</h3>
                  <p className="text-sm text-slate-500 dark:text-muted-foreground">Update dates, location, and client</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-slate-700 dark:text-foreground">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(dateButtonClass, !field.value && "text-slate-400 dark:text-foreground/60")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick start date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className={popoverContentClass} align="start">
                          <Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} captionLayout="dropdown" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-slate-700 dark:text-foreground">End Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(dateButtonClass, !field.value && "text-slate-400 dark:text-foreground/60")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick end date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className={popoverContentClass} align="start">
                          <Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} captionLayout="dropdown" />
                        </PopoverContent>
                      </Popover>

                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="mt-1 h-auto w-fit px-0 text-xs text-slate-500 hover:bg-transparent hover:text-rose-500 dark:text-foreground/60 dark:hover:text-rose-400"
                          onClick={() => field.onChange(null)}
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" />
                          Clear end date
                        </Button>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-slate-700 dark:text-foreground">Client</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentClass}>
                          {clientOptions.map((item: { label: string; value: string }) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-foreground">Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-foreground/60" />
                          <Input
                            placeholder="Enter project location"
                            className="h-11 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 pl-10 text-slate-700 placeholder:text-slate-400 focus-visible:border-purple-300 focus-visible:ring-2 focus-visible:ring-purple-300/40 dark:border-slate-700 dark:bg-slate-900 dark:text-foreground dark:placeholder:text-foreground/60 dark:focus-visible:ring-indigo-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className={sectionClass}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <ImagePlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-foreground">Project Images</h3>
                  <p className="text-sm text-slate-500 dark:text-foreground/60">
                    Current images are shown below. Upload new ones if you want to replace or add more.
                  </p>
                </div>
              </div>

              {(existingThumbnail || existingGallery.length > 0) && (
                <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {existingThumbnail && (
                    <div className={uploadCardClass}>
                      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">Current Thumbnail</p>
                      <img
                        src={existingThumbnail}
                        alt="Current thumbnail"
                        className="h-48 w-full rounded-2xl object-cover border border-purple-100 dark:border-slate-700"
                      />
                    </div>
                  )}

                  {existingGallery.length > 0 && (
                    <div className={uploadCardClass}>
                      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">Current Gallery</p>
                      <div className="grid grid-cols-2 gap-3">
                        {existingGallery.map((img: string, index: number) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="h-24 w-full rounded-2xl object-cover border border-purple-100 dark:border-slate-700"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className={uploadCardClass}>
                  <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">New Thumbnail / Featured Image</p>
                  <SingleImageUploader onChange={setImage} />
                </div>

                <div className={uploadCardClass}>
                  <p className="mb-3 text-sm font-medium text-slate-600 dark:text-foreground/60">New Gallery Images</p>
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="rounded-xl border-purple-200 bg-white text-slate-700 hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-purple-300 via-violet-300 to-blue-300 text-slate-900 shadow-md shadow-purple-200/50 hover:opacity-95 dark:from-violet-600 dark:via-indigo-600 dark:to-blue-600 dark:text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};

export default ProjectUpdate;
