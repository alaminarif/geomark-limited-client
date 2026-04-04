/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import MultipleImageUploader from "@/components/ui/MultipleImageUploader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { Textarea } from "@/components/ui/textarea";
import { ProjectStatus } from "@/constants/project";
import { cn } from "@/lib/utils";
import { useGetClientsQuery } from "@/redux/features/client/client.api";
import { useAddProjectMutation } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
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
    startDate: z.date({ message: "Start date is required" }),
    endDate: z.date().optional().nullable(),
    location: z.string().min(2, "Location is required"),
    client: z.string().min(1, "Client is required"),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    { message: "End date cannot be earlier than start date", path: ["endDate"] },
  );
type AddProjectFormValues = z.infer<typeof addProjectSchema>;
type UploadKind = "picture" | "gallery";
const MAX_SINGLE_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 8 * 1024 * 1024;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const canCompressImage = (file: File) => {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
};

const compressImageFile = async (file: File, kind: UploadKind) => {
  if (!canCompressImage(file)) {
    return file;
  }
  if (file.size <= 300 * 1024) {
    return file;
  }
  const options =
    kind === "picture"
      ? { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true, initialQuality: 0.82 }
      : { maxSizeMB: 0.8, maxWidthOrHeight: 1400, useWebWorker: true, initialQuality: 0.78 };
  const compressed = await imageCompression(file, options);
  return new File([compressed], file.name, { type: compressed.type || file.type, lastModified: Date.now() });
};

const AddProjectModal = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
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
  const { data: servicesData } = useGetAllServicesQuery(undefined);
  const { data: clientsData } = useGetClientsQuery(undefined);

  const serviceTitleOptions = useMemo(() => servicesData?.data?.map((item: any) => ({ value: item._id, label: item.name })) || [], [servicesData]);

  const clientOptions = useMemo(() => clientsData?.data?.map((item: any) => ({ value: item._id, label: item.name })) || [], [clientsData]);

  const projectStatusOptions = useMemo(() => ProjectStatus.map((status) => ({ value: status.value, label: status.label })), []);

  const getTotalUploadSize = useCallback(() => {
    let total = 0;
    if (image) {
      total += image.size;
    }
    images.forEach((file) => {
      total += file.size;
    });
    return total;
  }, [image, images]);

  const validateUploads = useCallback(() => {
    if (image && image.size > MAX_SINGLE_FILE_SIZE) {
      return `Thumbnail image must be smaller than ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`;
    }

    for (const file of images) {
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        return `Each gallery image must be smaller than ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`;
      }
    }

    const totalSize = getTotalUploadSize();
    if (totalSize > MAX_TOTAL_SIZE) {
      return `Total upload size is ${formatFileSize(totalSize)}. Maximum allowed is ${formatFileSize(MAX_TOTAL_SIZE)}`;
    }
    return null;
  }, [getTotalUploadSize, image, images]);

  const handleClose = useCallback(() => {
    setOpen(false);
    form.reset();
    setImage(null);
    setImages([]);
  }, [form]);

  const onSubmit = async (data: AddProjectFormValues) => {
    const uploadError = validateUploads();
    if (uploadError) {
      toast.error(uploadError);
      return;
    }
    const toastId = toast.loading("Adding project...");
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("objective", data.objective);
      formData.append("responsibility", data.responsibility);
      formData.append("status", data.status);
      formData.append("startDate", formatISO(data.startDate));
      formData.append("location", data.location);
      formData.append("client", data.client);
      if (data.endDate) {
        formData.append("endDate", formatISO(data.endDate));
      }
      if (image) {
        const compressedPicture = await compressImageFile(image, "picture");
        formData.append("picture", compressedPicture, compressedPicture.name);
      }
      if (images.length > 0) {
        const compressedGallery = await Promise.all(images.map((file) => compressImageFile(file, "gallery")));
        compressedGallery.forEach((file) => {
          formData.append("gallery", file, file.name);
        });
      }
      await addProject(formData).unwrap();
      toast.success("Project added successfully", { id: toastId });
      handleClose();
    } catch (error: any) {
      console.log(error);
      if (error?.status === 500 && error?.data?.err?.code === "LIMIT_UNEXPECTED_FILE") {
        toast.error("Upload field mismatch. Frontend must send picture and gallery.", { id: toastId });
        return;
      }
      if (error?.status === 413) {
        toast.error("Upload is still too large. Please use smaller images.", { id: toastId });
        return;
      }
      if (error?.status === "FETCH_ERROR") {
        toast.error("Network error occurred. Please check your connection and backend settings.", { id: toastId });
        return;
      }
      toast.error(error?.data?.message || error?.error || "Failed to add project", { id: toastId });
    }
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerTrigger asChild>
          <Button
            type="button"
            className="w-full rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/30"
          >
            <FolderPlus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </DrawerTrigger>
        <DrawerContent className="ml-auto h-screen w-[65vw]! max-w-300! rounded-none border-l text-foreground shadow-[0_0_40px_rgba(0,0,0,0.45)] sm:w-[72vw]! lg:w-[88vw]! xl:w-[82vw]! dark:border-slate-800 dark:bg-slate-950">
          <DrawerHeader className="border-b border-purple-100 dark:border-slate-800 dark:bg-slate-950/95 dark:backdrop-blur">
            <div className="rounded-3xl border p-5 shadow-lg dark:border-slate-800 dark:bg-linear-to-r dark:from-violet-600/90 dark:via-indigo-600/90 dark:to-blue-600/90">
              <DrawerTitle className="text-2xl font-semibold text-foreground">Add New Project</DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-foreground">
                Fill in the project details, schedule, client information and images.
              </DrawerDescription>
            </div>
          </DrawerHeader>

          <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Form {...form}>
                <form id="add-new-project" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
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
                                <SelectTrigger className={FormStyles.selectTrigger}>
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className={FormStyles.selectContent}>
                                {serviceTitleOptions.map((item: { label: string; value: string }) => (
                                  <SelectItem key={item.value} value={item.label}>
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
                                <SelectTrigger className={FormStyles.selectTrigger}>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className={FormStyles.selectContent}>
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
                                <Input placeholder="Enter project name" className={FormStyles.input} {...field} />
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
                                <Textarea placeholder="Write a short project description" className={FormStyles.textarea} {...field} />
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
                              <Textarea placeholder="Project objective" className={FormStyles.textarea} {...field} />
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
                              <Textarea placeholder="Scope of responsibility" className={FormStyles.textarea} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-blue-500/15 dark:text-violet-300">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Timeline & Client</h3>
                        <p className="text-sm text-foreground/70">Set project dates, location and client</p>
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
                                    className={cn(FormStyles.dateButton, !field.value && "text-slate-400 dark:text-foreground/60")}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick start date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className={FormStyles.popoverContent} align="start">
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
                                    className={cn(FormStyles.dateButton, !field.value && "text-slate-400 dark:text-foreground/60")}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick end date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className={FormStyles.popoverContent} align="start">
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
                                <XCircle className="mr-1 h-3.5 w-3.5" /> Clear end date
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
                                <SelectTrigger className={FormStyles.selectTrigger}>
                                  <SelectValue placeholder="Select client" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className={FormStyles.selectContent}>
                                {clientOptions.map((item: { label: string; value: string }) => (
                                  <SelectItem key={item.value} value={item.label}>
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
                                <Input placeholder="Enter project location" className={`${FormStyles.input} pl-8`} {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-emerald-500/15 dark:text-violet-300">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Project Images</h3>
                        <p className="text-sm text-foreground/60">Upload cover image and gallery images</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className={FormStyles.uploadCard}>
                        <p className="mb-3 text-sm font-medium text-foreground">Thumbnail / Featured Image</p>
                        <SingleImageUploader onChange={setImage} />
                      </div>
                      <div className={FormStyles.uploadCard}>
                        <p className="mb-3 text-sm font-medium text-foreground/60">Gallery Images</p>
                        <MultipleImageUploader onChange={setImages} />
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                      Keep each image under {formatFileSize(MAX_SINGLE_FILE_SIZE)} and total upload under {formatFileSize(MAX_TOTAL_SIZE)}.
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <FolderPlus className="mr-2 h-4 w-4" /> Submit Project
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
