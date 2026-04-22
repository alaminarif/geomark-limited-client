/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, FileText, ImagePlus, Loader2, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { useGetSingleServiceQuery, useUpdateServiceMutation } from "@/redux/features/service/service.api";

type UpdateServiceFormValues = {
  name: string;
  description: string;
};

type SubmitButton = "header" | "footer";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const defaultValues: UpdateServiceFormValues = {
  name: "",
  description: "",
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
  return value?.url || value?.secure_url || value?.path || value?.location || "";
};

const extractService = (payload: any) => {
  return payload?.data?.data || payload?.data?.service || payload?.service || payload?.data || payload || null;
};

const getErrorMessage = (error: any) => {
  return error?.data?.message || error?.data?.error || error?.error || error?.message || "Failed to update service";
};

const UpdateService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const imageRef = useRef<File | null>(null);
  const initialDataRef = useRef<Record<string, any> | null>(null);
  const initializedKeyRef = useRef("");
  const [activeSubmitButton, setActiveSubmitButton] = useState<SubmitButton | null>(null);

  const setImage = (file: File | null) => {
    imageRef.current = file;
  };

  const form = useForm<UpdateServiceFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const {
    data: serviceData,
    isLoading: serviceLoading,
    isFetching: serviceFetching,
  } = useGetSingleServiceQuery(id as string, {
    skip: !id,
  });

  const [updateService, { isLoading: isSubmitting }] = useUpdateServiceMutation();

  const service = useMemo(() => extractService(serviceData), [serviceData]);

  const existingImage = useMemo(() => {
    return (
      getImageUrl(service?.file) ||
      getImageUrl(service?.image) ||
      getImageUrl(service?.picture) ||
      getImageUrl(service?.photo) ||
      getImageUrl(service?.serviceImage) ||
      getImageUrl(service?.thumbnail) ||
      ""
    );
  }, [service]);

  useEffect(() => {
    initializedKeyRef.current = "";
    initialDataRef.current = null;
    imageRef.current = null;
    form.reset(defaultValues);
  }, [id, form]);

  useEffect(() => {
    if (!service) return;

    const initKey = [id || "", safeString(service?._id), safeString(service?.updatedAt)].join("|");
    if (initializedKeyRef.current === initKey) return;

    const formattedValues: UpdateServiceFormValues = {
      name: safeString(service?.name),
      description: safeString(service?.description),
    };

    form.reset(formattedValues);
    initialDataRef.current = {
      name: formattedValues.name,
      description: formattedValues.description,
    };
    initializedKeyRef.current = initKey;
  }, [id, service, form]);

  const validateImage = () => {
    if (imageRef.current && imageRef.current.size > MAX_IMAGE_SIZE) {
      return `Service image must be smaller than ${formatFileSize(MAX_IMAGE_SIZE)}`;
    }
    return null;
  };

  const onSubmit = async (data: UpdateServiceFormValues) => {
    if (!id) {
      toast.error("Service ID not found");
      return;
    }

    const imageError = validateImage();
    if (imageError) {
      toast.error(imageError);
      return;
    }

    const toastId = toast.loading("Updating service...");

    try {
      const normalizedData = {
        name: safeString(data.name),
        description: safeString(data.description),
      };

      const changedData: Record<string, any> = {};
      Object.entries(normalizedData).forEach(([key, value]) => {
        const oldValue = initialDataRef.current?.[key];
        if (oldValue !== value) {
          changedData[key] = value;
        }
      });

      const hasNewImage = !!imageRef.current;

      if (Object.keys(changedData).length === 0 && !hasNewImage) {
        toast.info("No changes detected", { id: toastId });
        return;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(changedData));

      if (imageRef.current) {
        formData.append("file", imageRef.current, imageRef.current.name);
      }

      await updateService({
        id,
        serviceData: formData,
      }).unwrap();

      toast.success("Service updated successfully", { id: toastId });
      navigate(`/admin/service/${id}`);
    } catch (error: any) {
      if (error?.status === 413) {
        toast.error("Image is too large. Please use a smaller image.", { id: toastId });
        return;
      }

      if (error?.status === "FETCH_ERROR") {
        toast.error("Network error occurred. Please check your connection and backend settings.", { id: toastId });
        return;
      }

      toast.error(getErrorMessage(error), { id: toastId });
      console.log(error);
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

  if (serviceLoading || serviceFetching) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 px-4 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:px-6">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Loading service data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 px-4 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:px-6">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-base font-medium text-slate-800 dark:text-slate-200">Service not found</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="mt-4 rounded-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      </div>
    );
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
              <h1 className="text-2xl font-semibold">Update Service</h1>
              <p className="mt-1 text-sm">Edit service name, description and image.</p>
            </div>
          </div>

          <Button
            type="submit"
            form="update-service-form"
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
          <form id="update-service-form" onSubmit={handleFormSubmit} className="min-w-0 space-y-5">
            <div className={FormStyles.section}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Service Information</h3>
                  <p className="text-sm text-foreground/70">Basic service identity and description details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Service name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Service Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                          <Input placeholder="Enter service name" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Description</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-foreground/60" />
                          <textarea
                            {...field}
                            value={field.value ?? ""}
                            rows={8}
                            placeholder="Enter service description"
                            className={`${FormStyles.input} min-h-40 w-full resize-none py-3 pl-9`}
                          />
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
                <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-amber-500/15 dark:text-amber-300">
                  <ImagePlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Service Image</h3>
                  <p className="text-sm text-foreground/70">Current image is shown below. Upload a new one if you want to replace it.</p>
                </div>
              </div>

              {existingImage && (
                <div className="mb-5">
                  <div className={FormStyles.uploadCard}>
                    <p className="mb-3 text-sm font-medium text-foreground">Current Service Image</p>
                    <img
                      src={existingImage}
                      alt="Current service"
                      className="h-56 w-full rounded-2xl border border-purple-100 object-cover dark:border-slate-700 md:max-w-sm"
                    />
                  </div>
                </div>
              )}

              <div className={FormStyles.uploadCard}>
                <p className="mb-3 text-sm font-medium text-foreground">New Service Image</p>
                <SingleImageUploader key={id || "service-uploader"} onChange={setImage} />
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                Keep the service image under {formatFileSize(MAX_IMAGE_SIZE)}.
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
                    <Save className="mr-2 h-4 w-4" /> Update Service
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

export default UpdateService;
