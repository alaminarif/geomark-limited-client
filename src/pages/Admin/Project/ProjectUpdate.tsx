/* eslint-disable @typescript-eslint/no-explicit-any */
import { SkeletonUpdateProject } from "@/components/modules/Admin/Project/SkeletonUpdateProject";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import MultipleImageUploader from "@/components/ui/MultipleImageUploader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { Textarea } from "@/components/ui/textarea";
import { ProjectStatus } from "@/constants/project";
import { cn } from "@/lib/utils";
import { useGetClientsQuery } from "@/redux/features/client/client.api";
import { useGetSingleProjectQuery, useUpdateProjectMutation } from "@/redux/features/project/project.api";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { updateProjectSchema } from "@/schemas/project.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { format, formatISO, isValid } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarIcon, ChevronDown, FolderPen, ImagePlus, Loader2, MapPin, Save, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;
type UploadKind = "picture" | "gallery";
type SelectOption = { value: string; label: string };
type SubmitButton = "header" | "footer";

const MAX_SINGLE_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 8 * 1024 * 1024;
const nativeSelectClassName =
  "h-11 w-full appearance-none rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 px-3 pr-10 text-slate-700 outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-300/40 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 dark:text-foreground";

const defaultValues: UpdateProjectFormValues = {
  service: "",
  name: "",
  description: "",
  objective: "",
  responsibility: "",
  status: "",
  startDate: undefined,
  endDate: null,
  location: "",
  client: "",
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const safeString = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const getImageUrl = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?.url || value?.secure_url || value?.path || "";
};

const extractArray = (payload: any, extraKeys: string[] = []) => {
  const candidates = [
    payload?.data?.data,
    payload?.data?.result,
    payload?.data?.items,
    payload?.data?.services,
    payload?.data?.clients,
    payload?.data,
    payload?.result,
    payload?.items,
    payload,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;

    if (candidate && typeof candidate === "object") {
      for (const key of extraKeys) {
        if (Array.isArray(candidate[key])) return candidate[key];
      }
    }
  }

  return [];
};

const extractProject = (payload: any) => {
  return payload?.data?.data || payload?.data?.project || payload?.project || payload?.data || payload || null;
};

const safeDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value as string | number | Date);
  return isValid(date) ? date : undefined;
};

const collectSelectCandidates = (rawValue: any) => {
  if (!rawValue) return [];

  const queue = [rawValue];
  const visited = new Set<any>();
  const candidates: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === null || current === undefined) continue;

    if (typeof current === "string" || typeof current === "number") {
      const value = String(current).trim();
      if (value) candidates.push(value);
      continue;
    }

    if (typeof current !== "object" || visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    const priorityKeys = ["_id", "id", "value", "name", "label", "title", "status"];

    priorityKeys.forEach((key) => {
      if (current[key] !== undefined && current[key] !== null) {
        queue.push(current[key]);
      }
    });

    Object.values(current).forEach((value) => {
      if (value !== undefined && value !== null) {
        queue.push(value);
      }
    });
  }

  return [...new Set(candidates)];
};

const findMatchingOption = (rawValue: any, options: SelectOption[]) => {
  const candidates = collectSelectCandidates(rawValue);

  for (const candidate of candidates) {
    const cleaned = candidate.trim().toLowerCase();

    const matchedByValue = options.find((item) => item.value.trim().toLowerCase() === cleaned);
    if (matchedByValue) return matchedByValue;

    const matchedByLabel = options.find((item) => item.label.trim().toLowerCase() === cleaned);
    if (matchedByLabel) return matchedByLabel;
  }

  return null;
};

const buildFallbackOption = (rawValue: any) => {
  const candidates = collectSelectCandidates(rawValue);
  if (!candidates.length) return null;

  const labelCandidate =
    candidates.find((item) => /[a-zA-Z]/.test(item) && item.length < 120) || candidates.find((item) => item.length < 120) || candidates[0];

  const valueCandidate = candidates[0];

  if (!valueCandidate || !labelCandidate) return null;

  return {
    value: valueCandidate,
    label: labelCandidate,
  };
};

const resolveSelectOption = (rawValue: any, options: SelectOption[]) => {
  return findMatchingOption(rawValue, options) || buildFallbackOption(rawValue);
};

const mergeSelectOptions = (options: SelectOption[], resolvedOption: SelectOption | null) => {
  if (!resolvedOption) return options;

  const exists = options.some(
    (item) =>
      item.value.trim().toLowerCase() === resolvedOption.value.trim().toLowerCase() ||
      item.label.trim().toLowerCase() === resolvedOption.label.trim().toLowerCase(),
  );

  if (exists) return options;

  return [resolvedOption, ...options];
};

const canCompressImage = (file: File) => {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
};

const compressImageFile = async (file: File, kind: UploadKind) => {
  if (!canCompressImage(file)) return file;
  if (file.size <= 300 * 1024) return file;

  const options =
    kind === "picture"
      ? { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true, initialQuality: 0.82 }
      : { maxSizeMB: 0.8, maxWidthOrHeight: 1400, useWebWorker: true, initialQuality: 0.78 };

  const compressed = await imageCompression(file, options);

  return new File([compressed], file.name, {
    type: compressed.type || file.type,
    lastModified: Date.now(),
  });
};

const ProjectUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const imageRef = useRef<File | null>(null);
  const imagesRef = useRef<File[]>([]);
  const setImage = useCallback((file: File | null) => {
    imageRef.current = file;
  }, []);

  const setImages = useCallback((files: File[]) => {
    imagesRef.current = files;
  }, []);

  const initialDataRef = useRef<Record<string, any> | null>(null);
  const initializedKeyRef = useRef("");
  const [activeSubmitButton, setActiveSubmitButton] = useState<SubmitButton | null>(null);

  const form = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    mode: "onChange",
    defaultValues,
  });

  const {
    data: projectData,
    isLoading: projectLoading,
    isFetching: projectFetching,
  } = useGetSingleProjectQuery(id, {
    skip: !id,
  });

  const { data: servicesData, isLoading: servicesLoading } = useGetAllServicesQuery({ limit: 100 });
  const { data: clientsData, isLoading: clientsLoading } = useGetClientsQuery({ limit: 100, sort: "-des" });
  const [updateProject, { isLoading: isSubmitting }] = useUpdateProjectMutation();

  const project = useMemo(() => extractProject(projectData), [projectData]);

  const services = useMemo(() => extractArray(servicesData, ["services"]), [servicesData]);
  const clients = useMemo(() => extractArray(clientsData, ["clients"]), [clientsData]);

  const serviceOptions = useMemo<SelectOption[]>(
    () =>
      services
        .map((item: any) => ({
          value: safeString(item?._id),
          label: safeString(item?.name),
        }))
        .filter((item: SelectOption) => item.value && item.label),
    [services],
  );

  const clientOptions = useMemo<SelectOption[]>(
    () =>
      clients
        .map((item: any) => ({
          value: safeString(item?._id),
          label: safeString(item?.name),
        }))
        .filter((item: SelectOption) => item.value && item.label),
    [clients],
  );

  const projectStatusOptions = useMemo<SelectOption[]>(
    () =>
      ProjectStatus.map((status) => ({
        value: safeString(status.value),
        label: safeString(status.label),
      })).filter((item) => item.value && item.label),
    [],
  );

  const resolvedServiceOption = useMemo(() => resolveSelectOption(project?.service, serviceOptions), [project?.service, serviceOptions]);
  const resolvedStatusOption = useMemo(() => resolveSelectOption(project?.status, projectStatusOptions), [project?.status, projectStatusOptions]);
  const resolvedClientOption = useMemo(() => resolveSelectOption(project?.client, clientOptions), [project?.client, clientOptions]);

  const hydratedServiceOptions = useMemo(() => mergeSelectOptions(serviceOptions, resolvedServiceOption), [serviceOptions, resolvedServiceOption]);
  const hydratedStatusOptions = useMemo(
    () => mergeSelectOptions(projectStatusOptions, resolvedStatusOption),
    [projectStatusOptions, resolvedStatusOption],
  );
  const hydratedClientOptions = useMemo(() => mergeSelectOptions(clientOptions, resolvedClientOption), [clientOptions, resolvedClientOption]);

  const existingThumbnail = useMemo(() => {
    return getImageUrl(project?.picture) || getImageUrl(project?.image) || getImageUrl(project?.thumbnail) || getImageUrl(project?.file) || "";
  }, [project]);

  const existingGallery = useMemo(() => {
    if (Array.isArray(project?.gallery)) return project.gallery.map(getImageUrl).filter(Boolean);
    if (Array.isArray(project?.images)) return project.images.map(getImageUrl).filter(Boolean);
    if (Array.isArray(project?.files)) return project.files.map(getImageUrl).filter(Boolean);
    return [];
  }, [project]);

  const serializeForSubmit = useCallback((values: UpdateProjectFormValues) => {
    return {
      service: values.service || "",
      name: safeString(values.name),
      description: safeString(values.description),
      objective: safeString(values.objective),
      responsibility: safeString(values.responsibility),
      status: values.status || "",
      startDate: values.startDate ? formatISO(values.startDate) : null,
      endDate: values.endDate ? formatISO(values.endDate) : null,
      location: safeString(values.location),
      client: values.client || "",
    };
  }, []);

  useEffect(() => {
    initializedKeyRef.current = "";
    initialDataRef.current = null;
    form.reset(defaultValues);
    imageRef.current = null;
    imagesRef.current = [];
  }, [id, form]);

  useEffect(() => {
    const isReady = !!project && projectStatusOptions.length > 0;
    if (!isReady) return;

    const initKey = [
      id || "",
      safeString(project?._id),
      hydratedServiceOptions.length,
      hydratedClientOptions.length,
      hydratedStatusOptions.length,
      safeString(resolvedServiceOption?.value),
      safeString(resolvedClientOption?.value),
      safeString(resolvedStatusOption?.value),
    ].join("|");

    if (initializedKeyRef.current === initKey) return;

    const formattedValues: UpdateProjectFormValues = {
      service: resolvedServiceOption?.value || "",
      name: safeString(project?.name),
      description: safeString(project?.description),
      objective: safeString(project?.objective),
      responsibility: safeString(project?.responsibility),
      status: resolvedStatusOption?.value || "",
      startDate: safeDate(project?.startDate),
      endDate: safeDate(project?.endDate) || null,
      location: safeString(project?.location),
      client: resolvedClientOption?.value || "",
    };

    form.reset(formattedValues);
    initialDataRef.current = serializeForSubmit(formattedValues);
    initializedKeyRef.current = initKey;
  }, [
    id,
    project,
    hydratedServiceOptions.length,
    hydratedClientOptions.length,
    hydratedStatusOptions.length,
    resolvedServiceOption,
    resolvedClientOption,
    resolvedStatusOption,
    projectStatusOptions.length,
    form,
    serializeForSubmit,
  ]);

  const getTotalUploadSize = useCallback(() => {
    let total = 0;

    if (imageRef.current) total += imageRef.current.size;

    imagesRef.current.forEach((file) => {
      total += file.size;
    });

    return total;
  }, []);

  const validateUploads = useCallback(() => {
    if (imageRef.current && imageRef.current.size > MAX_SINGLE_FILE_SIZE) {
      return `Thumbnail image must be smaller than ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`;
    }

    for (const file of imagesRef.current) {
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        return `Each gallery image must be smaller than ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`;
      }
    }

    const totalSize = getTotalUploadSize();
    if (totalSize > MAX_TOTAL_SIZE) {
      return `Total upload size is ${formatFileSize(totalSize)}. Maximum allowed is ${formatFileSize(MAX_TOTAL_SIZE)}`;
    }

    return null;
  }, [getTotalUploadSize]);

  const getErrorMessage = (error: any) => {
    return error?.data?.message || error?.data?.error || error?.error || error?.message || "Failed to update project";
  };

  const onSubmit = async (data: UpdateProjectFormValues) => {
    if (!id) {
      toast.error("Project ID not found");
      return;
    }

    const uploadError = validateUploads();
    if (uploadError) {
      toast.error(uploadError);
      return;
    }

    const toastId = toast.loading("Updating project...");

    try {
      const normalizedData = serializeForSubmit(data);

      const changedData: Record<string, any> = {};
      Object.entries(normalizedData).forEach(([key, value]) => {
        const oldValue = initialDataRef.current?.[key];
        if (oldValue !== value) {
          changedData[key] = value;
        }
      });

      const hasNewThumbnail = !!imageRef.current;
      const hasNewGallery = imagesRef.current.length > 0;

      if (Object.keys(changedData).length === 0 && !hasNewThumbnail && !hasNewGallery) {
        toast.info("No changes detected", { id: toastId });
        return;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(changedData));

      if (imageRef.current) {
        const compressedPicture = await compressImageFile(imageRef.current, "picture");
        formData.append("picture", compressedPicture, compressedPicture.name);
      }

      if (imagesRef.current.length > 0) {
        const compressedGallery = await Promise.all(imagesRef.current.map((file) => compressImageFile(file, "gallery")));
        compressedGallery.forEach((file) => {
          formData.append("gallery", file, file.name);
        });
      }

      await updateProject({ id, data: formData }).unwrap();

      toast.success("Project updated successfully", { id: toastId });
      navigate(-1);
    } catch (error: any) {
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

      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setActiveSubmitButton(null);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const submitSource = submitter?.dataset.submitSource as SubmitButton | undefined;
    setActiveSubmitButton(submitSource || "footer");
    form.handleSubmit(onSubmit)(event);
  };

  if (projectLoading || projectFetching || servicesLoading || clientsLoading) {
    return <SkeletonUpdateProject />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-purple-50 via-white to-blue-50 px-4 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-7xl min-w-0 space-y-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-xl border-purple-200 bg-white text-slate-700 hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="rounded-3xl border border-blue-400 px-4 py-2 text-foreground">
              <h1 className="text-2xl font-semibold">Update Project</h1>
              <p className="mt-1 text-sm">Edit project details, timeline, client information and images.</p>
            </div>
          </div>

          <Button
            type="submit"
            form="update-project-form"
            disabled={isSubmitting}
            data-submit-source="header"
            className="rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-2 text-foreground"
          >
            {isSubmitting && activeSubmitButton === "header" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>

        <Form {...form}>
          <form id="update-project-form" onSubmit={handleFormSubmit} className="min-w-0 space-y-5">
            <div className={FormStyles.section}>
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
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-foreground">Service</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <select
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            className={nativeSelectClassName}
                          >
                            <option value="" disabled>
                              Select service
                            </option>
                            {hydratedServiceOptions.length > 0 ? (
                              hydratedServiceOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                No services available
                              </option>
                            )}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-foreground/60" />
                        </div>
                      </FormControl>
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
                      <FormControl>
                        <div className="relative">
                          <select
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            className={nativeSelectClassName}
                          >
                            <option value="" disabled>
                              Select status
                            </option>
                            {hydratedStatusOptions.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-foreground/60" />
                        </div>
                      </FormControl>
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
                          <Input placeholder="Enter project name" className={FormStyles.input} {...field} value={field.value ?? ""} />
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
                          <Textarea
                            placeholder="Write a short project description"
                            className={FormStyles.textarea}
                            {...field}
                            value={field.value ?? ""}
                          />
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
                        <Textarea placeholder="Project objective" className={FormStyles.textarea} {...field} value={field.value ?? ""} />
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
                        <Textarea placeholder="Scope of responsibility" className={FormStyles.textarea} {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className={FormStyles.section}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-foreground">Timeline & Client</h3>
                  <p className="text-sm text-slate-500 dark:text-muted-foreground">Update dates, location and client</p>
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
                      <FormLabel className="text-slate-700 dark:text-foreground">End Date (Optional)</FormLabel>
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
                          className="mt-1 h-auto w-fit px-0 text-xs text-slate-500 hover:bg-transparent hover:text-rose-500 dark:text-foreground/60 dark:hover:text-rose-400"
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
                      <FormLabel className="text-slate-700 dark:text-foreground">Client</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <select
                            {...field}
                            value={field.value ?? ""}
                            onChange={(event) => field.onChange(event.target.value)}
                            className={nativeSelectClassName}
                          >
                            <option value="" disabled>
                              Select client
                            </option>
                            {hydratedClientOptions.length > 0 ? (
                              hydratedClientOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                No clients available
                              </option>
                            )}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-foreground/60" />
                        </div>
                      </FormControl>
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
                        <div className="relative min-w-0 w-full">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-foreground/60" />
                          <Input placeholder="Enter project location" className={`${FormStyles.input} pl-8`} {...field} value={field.value ?? ""} />
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
                    <div className={FormStyles.uploadCard}>
                      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">Current Thumbnail</p>
                      <img
                        src={existingThumbnail}
                        alt="Current thumbnail"
                        className="h-48 w-full rounded-2xl border border-purple-100 object-cover dark:border-slate-700"
                      />
                    </div>
                  )}

                  {existingGallery.length > 0 && (
                    <div className={FormStyles.uploadCard}>
                      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">Current Gallery</p>
                      <div className="grid grid-cols-2 gap-3">
                        {existingGallery.map((img: string, index: number) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="h-24 w-full rounded-2xl border border-purple-100 object-cover dark:border-slate-700"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className={FormStyles.uploadCard}>
                  <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">New Thumbnail / Featured Image</p>
                  <SingleImageUploader onChange={setImage} />
                </div>

                <div className={FormStyles.uploadCard}>
                  <p className="mb-3 text-sm font-medium text-slate-600 dark:text-foreground/60">New Gallery Images</p>
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                Keep each image under {formatFileSize(MAX_SINGLE_FILE_SIZE)} and total upload under {formatFileSize(MAX_TOTAL_SIZE)}.
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
                data-submit-source="footer"
                className="rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-2 text-foreground"
              >
                {isSubmitting && activeSubmitButton === "footer" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Update Project
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
