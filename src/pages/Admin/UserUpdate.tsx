/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGetSingleUserQuery, useUpdateUserMutation } from "@/redux/features/user/user.api";
import SingleImageUploader from "@/components/ui/SingleImageUploader";

type TFormValues = {
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: string;
};

const UserUpdateSkeleton = () => {
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
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-52 w-full animate-pulse rounded-2xl bg-muted" />
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
              </div>
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

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<TFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      isActive: "ACTIVE",
    },
  });

  const { data, isLoading, isError } = useGetSingleUserQuery(id as string, {
    skip: !id,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const user = data?.data;

  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        role: user?.role || "",
        isActive: user?.isActive || "ACTIVE",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: TFormValues) => {
    if (!id) {
      toast.error("User ID not found");
      return;
    }

    const toastId = toast.loading("Updating user...");

    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
        isActive: values.isActive,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(userData));

      if (image) {
        formData.append("file", image);
      }

      await updateUser({
        id,
        userData: formData,
      }).unwrap();

      toast.success("User updated successfully", { id: toastId });
      navigate(`/admin/user/${id}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user", {
        id: toastId,
      });
      console.log(error);
    }
  };

  if (!id) {
    return (
      <div className="mx-auto max-w-5xl rounded-3xl border bg-background p-6 shadow-sm">
        <p className="text-sm text-red-500">Invalid user ID.</p>
      </div>
    );
  }

  if (isLoading) {
    return <UserUpdateSkeleton />;
  }

  if (isError || !user) {
    return (
      <div className="mx-auto max-w-5xl rounded-3xl border bg-background p-6 shadow-sm">
        <p className="text-sm text-red-500">User not found.</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Update User</h1>
          <p className="text-sm text-muted-foreground">
            Modify user information, status and picture.
          </p>
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
                <p className="mb-3 text-sm font-medium">Profile Picture</p>

                {user?.picture && !image && (
                  <div className="mb-4 overflow-hidden rounded-2xl border">
                    <img
                      src={user.picture}
                      alt={user.name || "User"}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                )}

                <SingleImageUploader onChange={setImage} />
              </div>
            </div>

            <div className="space-y-5 lg:col-span-2">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Phone is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="role"
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Select role</option>
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="BLOCKED">Blocked</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to={`/admin/user/${id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update User"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </motion.div>
  );
};

export default UserUpdate;