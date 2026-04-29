/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { role as userRole } from "@/constants/role";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BadgeCheck, Ban, Crown, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGetSingleUserQuery, useUpdateUserMutation } from "@/redux/features/user/user.api";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { SkeletonUserUpdate } from "@/components/modules/Admin/User/SkeletonUserUpdate";

const dashboardSelectContentClassName =
  "max-h-80 w-[var(--radix-select-trigger-width)] rounded-2xl border-blue-200 bg-white p-2 text-slate-700 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-foreground";

const dashboardSelectItemClassName =
  "mb-1 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:bg-blue-50 focus:text-blue-700 dark:text-foreground dark:focus:bg-slate-800 dark:focus:text-blue-200";

const dashboardSelectMarkerClassName = "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold";
const dashboardSelectTriggerClassName =
  "h-13! w-full rounded-xl border border-blue-300 bg-gradient-to-r from-purple-50 to-blue-50 text-slate-700 focus:ring-2 focus:ring-purple-300/40 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 dark:text-foreground";

const roleOptions = [
  {
    value: userRole.user,
    label: "User",
    description: "Standard dashboard access",
    markerClassName: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    Icon: UserRound,
  },
  {
    value: userRole.admin,
    label: "Admin",
    description: "Can manage operational content",
    markerClassName: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
    Icon: ShieldCheck,
  },
  {
    value: userRole.superAdmin,
    label: "Super Admin",
    description: "Full administrative access",
    markerClassName: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300",
    Icon: Crown,
  },
];

const statusOptions = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "User can sign in and use the dashboard",
    markerClassName: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    Icon: BadgeCheck,
  },
  {
    value: "INACTIVE",
    label: "Inactive",
    description: "Account is paused without being blocked",
    markerClassName: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
    Icon: Ban,
  },
  {
    value: "BLOCKED",
    label: "Blocked",
    description: "User access is restricted",
    markerClassName: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
    Icon: Ban,
  },
];

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);

  const form = useForm({
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

  const onSubmit = async (values: any) => {
    if (!id) {
      toast.error("User ID not found");
      return;
    }

    const toastId = toast.loading("Updating user...");

    try {
      const userData = {
        name: values?.name,
        email: values?.email,
        phone: values?.phone,
        role: values?.role,
        isActive: values?.isActive,
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
    return <SkeletonUserUpdate />;
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
          <p className="text-sm text-muted-foreground">Modify user information, status and picture.</p>
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
                    <img src={user.picture} alt={user.name || "User"} className="h-56 w-full object-cover" />
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
                      <Input type="email" placeholder="Enter email address" {...field} value={field.value || ""} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} value={field.value || ""} />
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
                  render={({ field }) => {
                    const selectedRoleValue = field.value || user?.role || "";
                    const selectedRoleOption = roleOptions.find((item) => item.value === selectedRoleValue);

                    return (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={selectedRoleValue || undefined}>
                          <FormControl>
                            <SelectTrigger className={cn(dashboardSelectTriggerClassName, "h-auto! min-h-16 min-w-0 overflow-hidden py-2 text-left")}>
                              <SelectValue placeholder="Select role" className="min-w-0 flex-col items-start! gap-0! line-clamp-none!">
                                {selectedRoleOption && (
                                  <span className="flex min-w-0 flex-col items-start leading-tight">
                                    <span className="block max-w-full truncate font-medium">{selectedRoleOption.label}</span>
                                    <span className="mt-0.5 block max-w-full truncate text-xs leading-snug text-muted-foreground">
                                      {selectedRoleOption.description}
                                    </span>
                                  </span>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={dashboardSelectContentClassName} position="popper" align="start">
                            {roleOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value} className={dashboardSelectItemClassName}>
                                <span className="flex min-w-0 items-center gap-2">
                                  <span className={cn(dashboardSelectMarkerClassName, item.markerClassName)}>
                                    <item.Icon className="size-4" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block font-medium leading-snug">{item.label}</span>
                                    <span className="block whitespace-normal wrap-break-word text-xs leading-snug text-muted-foreground">
                                      {item.description}
                                    </span>
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  rules={{ required: "Status is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger className={cn(dashboardSelectTriggerClassName, "min-w-0 overflow-hidden text-left")}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={dashboardSelectContentClassName} position="popper" align="start">
                          {statusOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value} className={dashboardSelectItemClassName}>
                              <span className="flex min-w-0 items-center gap-2">
                                <span className={cn(dashboardSelectMarkerClassName, item.markerClassName)}>
                                  <item.Icon className="size-4" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block font-medium leading-snug">{item.label}</span>
                                  <span className="block whitespace-normal wrap-break-word text-xs leading-snug text-muted-foreground">
                                    {item.description}
                                  </span>
                                </span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {/* <Link to={`/admin/user/${id}`}> */}
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                {/* </Link> */}

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-linear-to-r from-purple-500 to-blue-500 shadow-lg transition-all duration-300 hover:shadow-purple-500/30 py-2.5 px-4 text-sm font-semibold text-white"
                >
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
