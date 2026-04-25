import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useChangePasswordMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from old password",
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const getErrorMessage = (error: unknown) => {
  const apiError = error as {
    data?: {
      message?: string;
      error?: string;
    };
    error?: string;
    message?: string;
  };

  return apiError?.data?.message || apiError?.data?.error || apiError?.error || apiError?.message || "Failed to change password";
};

export default function ChangePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: userData } = useUserInfoQuery(undefined);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    const toastId = toast.loading("Changing password...");

    try {
      const res = await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success(res?.message || "Password changed successfully", { id: toastId });
      form.reset();
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    }
  };

  const userName = userData?.data?.name || "Your account";
  const userEmail = userData?.data?.email || "Signed-in user";

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
      <Card className="overflow-hidden border-slate-200 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <CardHeader className="border-b border-slate-200/80 bg-linear-to-r from-slate-50 via-white to-amber-50/70 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-2xl text-slate-900 dark:text-white">Change password</CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Update your dashboard password for {userName}. You will stay signed in after the change.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Current password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          {...field}
                          type={showOldPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Enter current password"
                          className={cn(FormStyles.input, "pl-9 pr-11")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                          aria-label={showOldPassword ? "Hide current password" : "Show current password"}
                        >
                          {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">New password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Enter new password"
                          className={cn(FormStyles.input, "pl-9 pr-11")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                          aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm new password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Confirm new password"
                          className={cn(FormStyles.input, "pl-9 pr-11")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className={cn(FormStyles.button, isLoading && "cursor-not-allowed opacity-70")}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating password...
                  </span>
                ) : (
                  "Save new password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="h-fit border-slate-200 bg-white/85 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-white">Account security</CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Signed in as <span className="font-medium text-slate-700 dark:text-slate-200">{userEmail}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
            Choose a password you do not reuse anywhere else and keep it memorable enough that you do not need to write it down.
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
            If your old password is incorrect, the backend will reject the request with the same validation used on the server.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
