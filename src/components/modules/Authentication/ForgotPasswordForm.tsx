import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForgotPasswordMutation } from "@/redux/features/auth/auth.api";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { type ComponentPropsWithoutRef } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";

type ForgotPasswordFormProps = ComponentPropsWithoutRef<"div">;

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const form = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      console.log(data);
      const email = data.email as string;
      console.log(forgotPassword);
      const res = await forgotPassword({ email }).unwrap();

      toast.success(res?.message || "Password reset link sent to your email");
      form.reset();
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/15" />
          <div className="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/15" />
        </div>

        <div className="relative z-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Forgot password</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Enter your email address and we will send you a password reset link.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          autoComplete="email"
                          className={cn(FormStyles.input, "pl-9")}
                          {...field}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:scale-[1.01] hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
