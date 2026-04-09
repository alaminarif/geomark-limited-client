/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { format, formatISO, isValid } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarIcon, ImagePlus, Loader2, Mail, MapPin, Phone, Save, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { cn } from "@/lib/utils";
import { useGetSingleClientQuery, useUpdateClientMutation } from "@/redux/features/client/client.api";
import { updateClientSchema } from "@/schemas/client.schema";

type UpdateClientFormValues = z.infer<typeof updateClientSchema>;

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const defaultValues: UpdateClientFormValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  joinDate: undefined,
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

const safeDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value as string | number | Date);
  return isValid(date) ? date : undefined;
};

const getImageUrl = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?.url || value?.secure_url || value?.path || value?.location || "";
};

const extractClient = (payload: any) => {
  return payload?.data?.data || payload?.data?.client || payload?.client || payload?.data || payload || null;
};

const canCompressImage = (file: File) => {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
};

const compressProfileImage = async (file: File) => {
  if (!canCompressImage(file)) return file;
  if (file.size <= 300 * 1024) return file;

  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    initialQuality: 0.82,
  });

  return new File([compressed], file.name, {
    type: compressed.type || file.type,
    lastModified: Date.now(),
  });
};

const UpdateClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const imageRef = useRef<File | null>(null);
  const initialDataRef = useRef<Record<string, any> | null>(null);
  const initializedKeyRef = useRef("");

  const setImage = useCallback((file: File | null) => {
    imageRef.current = file;
  }, []);

  const form = useForm<UpdateClientFormValues>({
    resolver: zodResolver(updateClientSchema),
    mode: "onChange",
    defaultValues,
  });

  const {
    data: clientData,
    isLoading: clientLoading,
    isFetching: clientFetching,
  } = useGetSingleClientQuery(id, {
    skip: !id,
  });

  const [updateClient, { isLoading: isSubmitting }] = useUpdateClientMutation();

  const client = useMemo(() => extractClient(clientData), [clientData]);

  const existingImage = useMemo(() => {
    return (
      getImageUrl(client?.file) ||
      getImageUrl(client?.image) ||
      getImageUrl(client?.picture) ||
      getImageUrl(client?.photo) ||
      getImageUrl(client?.profileImage) ||
      getImageUrl(client?.avatar) ||
      ""
    );
  }, [client]);

  const serializeForSubmit = useCallback((values: UpdateClientFormValues) => {
    return {
      name: safeString(values.name),
      email: safeString(values.email),
      phone: safeString(values.phone),
      address: safeString(values.address),
      joinDate: values.joinDate ? formatISO(values.joinDate) : undefined,
    };
  }, []);

  useEffect(() => {
    initializedKeyRef.current = "";
    initialDataRef.current = null;
    imageRef.current = null;
    form.reset(defaultValues);
  }, [id, form]);

  useEffect(() => {
    if (!client) return;

    const initKey = [id || "", safeString(client?._id), safeString(client?.updatedAt)].join("|");
    if (initializedKeyRef.current === initKey) return;

    const formattedValues: UpdateClientFormValues = {
      name: safeString(client?.name),
      email: safeString(client?.email),
      phone: safeString(client?.phone),
      address: safeString(client?.address),
      joinDate: safeDate(client?.joinDate),
    };

    form.reset(formattedValues);
    initialDataRef.current = serializeForSubmit(formattedValues);
    initializedKeyRef.current = initKey;
  }, [id, client, form, serializeForSubmit]);

  const validateImage = useCallback(() => {
    if (imageRef.current && imageRef.current.size > MAX_IMAGE_SIZE) {
      return `Profile image must be smaller than ${formatFileSize(MAX_IMAGE_SIZE)}`;
    }

    return null;
  }, []);

  const getErrorMessage = (error: any) => {
    return error?.data?.message || error?.data?.error || error?.error || error?.message || "Failed to update client";
  };

  const onSubmit = async (data: UpdateClientFormValues) => {
    if (!id) {
      toast.error("Client ID not found");
      return;
    }

    const imageError = validateImage();
    if (imageError) {
      toast.error(imageError);
      return;
    }

    const toastId = toast.loading("Updating client...");

    try {
      const normalizedData = serializeForSubmit(data);

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
        const compressedImage = await compressProfileImage(imageRef.current);
        formData.append("file", compressedImage, compressedImage.name);
      }

      await updateClient({ id, data: formData }).unwrap();

      toast.success("Client updated successfully", { id: toastId });
      navigate(-1);
    } catch (error: any) {
      if (error?.status === 500 && error?.data?.err?.code === "LIMIT_UNEXPECTED_FILE") {
        toast.error("Upload field mismatch. Frontend must send file.", { id: toastId });
        return;
      }

      if (error?.status === 413) {
        toast.error("Image is still too large. Please use a smaller image.", { id: toastId });
        return;
      }

      if (error?.status === "FETCH_ERROR") {
        toast.error("Network error occurred. Please check your connection and backend settings.", { id: toastId });
        return;
      }

      toast.error(getErrorMessage(error), { id: toastId });
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(onSubmit)(event);
  };

  if (clientLoading || clientFetching) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 px-4 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:px-6">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
            <span className="text-sm text-slate-600 dark:text-slate-300">Loading client data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 px-4 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:px-6">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-base font-medium text-slate-800 dark:text-slate-200">Client not found</p>
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

            <div className="rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-2 text-foreground">
              <h1 className="text-2xl font-semibold">Update Client</h1>
              <p className="mt-1 text-sm">Edit client information, joining details and image.</p>
            </div>
          </div>

          <Button
            type="submit"
            form="update-client-form"
            disabled={isSubmitting}
            className="rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-2 text-foreground"
          >
            {isSubmitting ? (
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
          <form id="update-client-form" onSubmit={handleFormSubmit} className="min-w-0 space-y-5">
            <div className={FormStyles.section}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Client Information</h3>
                  <p className="text-sm text-foreground/70">Basic client identity and contact details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Client Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                          <Input placeholder="Enter client name" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                          <Input placeholder="Enter email address" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                          <Input placeholder="Enter phone number" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                          <Input placeholder="Enter address" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-foreground">Join Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(FormStyles.dateButton, !field.value && "text-slate-400 dark:text-foreground/60")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick join date</span>}
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
              </div>
            </div>

            <div className={FormStyles.section}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-amber-500/15 dark:text-amber-300">
                  <ImagePlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Client Image</h3>
                  <p className="text-sm text-foreground/70">Current image is shown below. Upload a new one if you want to replace it.</p>
                </div>
              </div>

              {existingImage && (
                <div className="mb-5">
                  <div className={FormStyles.uploadCard}>
                    <p className="mb-3 text-sm font-medium text-foreground">Current Client Image</p>
                    <img
                      src={existingImage}
                      alt="Current client"
                      className="h-56 w-full rounded-2xl border border-purple-100 object-cover dark:border-slate-700 md:max-w-sm"
                    />
                  </div>
                </div>
              )}

              <div className={FormStyles.uploadCard}>
                <p className="mb-3 text-sm font-medium text-foreground">New Client Image</p>
                <SingleImageUploader onChange={setImage} />
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                Keep the profile image under {formatFileSize(MAX_IMAGE_SIZE)}.
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
                className="rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-2 text-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Update Client
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

export default UpdateClient;
