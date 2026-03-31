/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layout/Loading";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { useAddProjectMutation } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { motion } from "framer-motion";
import { CalendarIcon, FolderPlus, ImagePlus, Loader2, MapPin, XCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addProjectSchema = z
  .object({
    title: z.string().min(1, "Service is required"),
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    objective: z.string().min(5, "Objective is required"),
    responsibility: z.string().min(5, "Responsibility is required"),
    status: z.string().min(1, "Status is required"),
    startDate: z.date({
      message: "Start date is required",
    }),
    endDate: z.date().optional().nullable(),
    location: z.string().min(2, "Location is required"),
    client: z.string().min(1, "Client is required"),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "End date cannot be earlier than start date",
      path: ["endDate"],
    },
  );

type AddProjectFormValues = z.infer<typeof addProjectSchema>;

const sectionClass = "rounded-3xl border dark:border-slate-800 dark:bg-slate-900/80 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm";
const inputClass =
  "h-11 rounded-xl dark:border-slate-700 dark:bg-slate-900 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-indigo-500";
const textareaClass =
  "min-h-[110px] rounded-xl dark:border-slate-700 dark:bg-slate-900 text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-1 focus-visible:ring-indigo-500";

const AddProjectModal = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<(File | FileMetadata)[]>([]);

  const form = useForm<AddProjectFormValues>({
    resolver: zodResolver(addProjectSchema),
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

  const [addProject, { isLoading: isSubmitting }] = useAddProjectMutation();
  const { data: servicesData, isLoading: servicesLoading } = useGetAllServicesQuery(undefined);
  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery(undefined);

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

  const handleClose = useCallback(() => {
    setOpen(false);
    form.reset();
    setImage(null);
    setImages([]);
  }, [form]);

  const onSubmit = async (data: AddProjectFormValues) => {
    const toastId = toast.loading("Adding project...");

    try {
      const projectData = {
        ...data,
        startDate: formatISO(data.startDate),
        endDate: data.endDate ? formatISO(data.endDate) : null,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(projectData));

      if (image) {
        formData.append("file", image);
      }

      images.forEach((item) => {
        if (item instanceof File) {
          formData.append("files", item);
        }
      });

      await addProject(formData).unwrap();

      toast.success("Project added successfully", { id: toastId });
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add project", { id: toastId });
      console.log(error);
    }
  };

  if (servicesLoading || clientsLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerTrigger asChild>
          <Button
            type="button"
            className="w-full rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/30"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </DrawerTrigger>

        <DrawerContent className="ml-auto h-screen w-[65vw]! sm:w-[72vw]! lg:w-[88vw]! xl:w-[82vw]! max-w-300! rounded-none border-l dark:border-slate-800 dark:bg-slate-950 text-foreground shadow-[0_0_40px_rgba(0,0,0,0.45)]">
          <DrawerHeader className="border-b border-purple-100  dark:border-slate-800 dark:bg-slate-950/95 dark:backdrop-blur">
            <div className="rounded-3xl border dark:border-slate-800 dark:bg-linear-to-r dark:from-violet-600/90 dark:via-indigo-600/90 dark:to-blue-600/90 p-5  shadow-lg">
              <DrawerTitle className="text-2xl text-foreground font-semibold">Add New Project</DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-foreground">
                Fill in the project details, schedule, client information, and images.
              </DrawerDescription>
            </div>
          </DrawerHeader>

          <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Form {...form}>
                <form id="add-new-project" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className={sectionClass}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl dark:bg-violet-500/15 p-2.5 text-violet-600 dark:text-violet-300">
                        <FolderPlus className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Project Information</h3>
                        <p className="text-sm text-foreground/70">Basic information about the project</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Service</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                              <FormControl>
                                <SelectTrigger className="h-11! w-full rounded-xl dark:border-slate-700 dark:bg-slate-900 text-foreground">
                                  <SelectValue placeholder="Select service" className="" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark:border-slate-800 dark:bg-slate-900 text-foreground ">
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
                            <FormLabel className="text-foreground">Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                              <FormControl>
                                <SelectTrigger className="h-11! w-full rounded-xl dark:border-slate-700 dark:bg-slate-900 text-foreground ">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark:border-slate-800 dark:bg-slate-900 text-foreground">
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
                              <FormLabel className="text-foreground">Project Name</FormLabel>
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
                              <FormLabel className="text-foreground">Description</FormLabel>
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
                            <FormLabel className="text-foreground">Objective</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Project objective"
                                className="min-h-25 rounded-xl dark:border-slate-700 dark:bg-slate-900 text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-1 focus-visible:ring-indigo-500"
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
                            <FormLabel className="text-foreground">Responsibility</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Scope of responsibility"
                                className="min-h-25 rounded-xl dark:border-slate-700 dark:bg-slate-900 placeholder:text-muted-foreground  resize-none focus-visible:ring-1 focus-visible:ring-indigo-500"
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
                      <div className="rounded-2xl dark:bg-blue-500/15 p-2.5 text-violet-600 dark:text-violet-300">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Timeline & Client</h3>
                        <p className="text-sm text-foreground/70">Set project dates, location, and client</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-foreground">Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                      "h-11 justify-start rounded-xl dark:border-slate-700 dark:bg-slate-900 pl-3 text-left font-normal text-foreground dark:hover:bg-slate-800",
                                      !field.value && "text-foreground/60",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick start date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto rounded-xl dark:border-slate-800 dark:bg-slate-900 p-0 text-foreground" align="start">
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
                            <FormLabel className="text-foreground">End Date (Optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                      "h-11 justify-start rounded-xl dark:border-slate-700 dark:bg-slate-900 pl-3 text-left font-normal text-foreground dark:hover:bg-slate-800",
                                      !field.value && "text-foreground/60",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick end date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto rounded-xl dark:border-slate-800 dark:bg-slate-900 p-0 text-foreground" align="start">
                                <Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} captionLayout="dropdown" />
                              </PopoverContent>
                            </Popover>

                            {field.value && (
                              <Button
                                type="button"
                                variant="ghost"
                                className="mt-1 h-auto w-fit px-0 text-xs text-foreground/60 hover:bg-transparent hover:text-rose-400"
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
                            <FormLabel className="text-foreground">Client</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                              <FormControl>
                                <SelectTrigger className="h-11! w-full rounded-xl dark:border-slate-700 dark:bg-slate-900 text-foreground">
                                  {/* <User2 className="mr-2 h-4 w-4 text-foreground/60" /> */}
                                  <SelectValue placeholder="Select client" className="" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark:border-slate-800 dark:bg-slate-900 text-foreground w-full">
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
                            <FormLabel className="text-foreground">Location</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input
                                  placeholder="Enter project location"
                                  className="h-11 rounded-xl dark:border-slate-700 dark:bg-slate-900 pl-10 text-foreground placeholder:text-foreground/60 focus-visible:ring-1 focus-visible:ring-indigo-500"
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
                      <div className="rounded-2xl dark:bg-emerald-500/15 p-2.5 text-violet-600 dark:text-violet-300">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Project Images</h3>
                        <p className="text-sm text-foreground/60">Upload cover image and gallery images</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="rounded-3xl border border-dashed dark:border-slate-700 dark:bg-slate-950/60 p-4">
                        <p className="mb-3 text-sm font-medium text-foreground">Thumbnail / Featured Image</p>
                        <SingleImageUploader onChange={setImage} />
                      </div>

                      <div className="rounded-3xl border border-dashed dark:border-slate-700 dark:bg-slate-950/60 p-4">
                        <p className="mb-3 text-sm font-medium text-foreground/60">Gallery Images</p>
                        <MultipleImageUploader onChange={setImages} />
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </motion.div>
          </div>

          <DrawerFooter className="border-t dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                type="submit"
                form="add-new-project"
                disabled={isSubmitting}
                className="rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-md hover:opacity-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Submit Project
                  </>
                )}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AddProjectModal;
