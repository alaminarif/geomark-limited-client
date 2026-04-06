/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { useGetSingleServiceQuery, useUpdateServiceMutation } from "@/redux/features/service/service.api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

type TFormValues = {
  name: string;
  description: string;
};

const ServiceUpdateSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-52 animate-pulse rounded-xl bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded-xl bg-muted" />
      </div>

      <div className="rounded-3xl border bg-background p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-1">
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            <div className="h-52 w-full animate-pulse rounded-2xl bg-muted" />
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-36 w-full animate-pulse rounded-2xl bg-muted" />
            </div>

            <div className="flex gap-3 pt-2">
              <div className="h-11 w-28 animate-pulse rounded-xl bg-muted" />
              <div className="h-11 w-36 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<TFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data, isLoading, isError } = useGetSingleServiceQuery(id as string, {
    skip: !id,
  });

  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const service = data?.data?.data || data?.data || data;

  useEffect(() => {
    if (service) {
      form.reset({
        name: service?.name || "",
        description: service?.description || "",
      });
    }
  }, [service, form]);

  const onSubmit = async (values: TFormValues) => {
    if (!id) {
      toast.error("Service ID not found");
      return;
    }

    const currentName = service?.name?.trim() || "";
    const currentDescription = service?.description?.trim() || "";

    const newName = values.name.trim();
    const newDescription = values.description.trim();

    const changedData: Record<string, string> = {};

    if (newName !== currentName) {
      changedData.name = newName;
    }

    if (newDescription !== currentDescription) {
      changedData.description = newDescription;
    }

    if (Object.keys(changedData).length === 0 && !image) {
      toast.error("No changes detected");
      return;
    }

    const toastId = toast.loading("Updating service...");

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(changedData));

      if (image) {
        formData.append("file", image);
      }

      await updateService({
        id,
        serviceData: formData,
      }).unwrap();

      toast.success("Service updated successfully", { id: toastId });
      navigate(`/admin/service/${id}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update service", {
        id: toastId,
      });
      console.log(error);
    }
  };

  if (!id) {
    return (
      <div className="mx-auto max-w-5xl rounded-3xl border bg-background p-6 shadow-sm">
        <p className="text-sm text-red-500">Invalid service ID.</p>
      </div>
    );
  }

  if (isLoading) {
    return <ServiceUpdateSkeleton />;
  }

  if (isError || !service) {
    return (
      <div className="mx-auto max-w-5xl rounded-3xl border bg-background p-6 shadow-sm">
        <p className="text-sm text-red-500">Service not found.</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto w-full max-w-5xl space-y-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Update Service</h1>
          <p className="text-sm text-muted-foreground">Modify service name, description and picture.</p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08, duration: 0.25 }}
        className="rounded-3xl border bg-background p-6 shadow-sm"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              <div className="rounded-2xl border p-4">
                <p className="mb-3 text-sm font-medium">Service Image</p>

                {service?.picture && !image && (
                  <div className="mb-4 overflow-hidden rounded-2xl border">
                    <img src={service.picture} alt={service.name || "Service"} className="h-56 w-full object-cover" />
                  </div>
                )}

                <SingleImageUploader onChange={setImage} />
              </div>
            </div>

            <div className="space-y-5 lg:col-span-2">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Service name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service name" {...field} value={field.value || ""} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        value={field.value || ""}
                        rows={8}
                        placeholder="Enter service description"
                        className="flex min-h-45 w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-linear-to-r from-purple-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/30"
                >
                  {isUpdating ? "Updating..." : "Update Service"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
};

export default ServiceUpdate;
