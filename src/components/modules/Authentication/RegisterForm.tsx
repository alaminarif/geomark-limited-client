import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import { Eye, EyeOff, Loader2, Lock, Mail, UserPlus, User } from "lucide-react";
import { useState, type ComponentPropsWithoutRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(3, { message: "Name is too short" }).max(50, { message: "Name is too long" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(6, { message: "Password is too short" }),
    confirmPassword: z.string().min(6, { message: "Confirm Password is too short" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormProps = ComponentPropsWithoutRef<"div">;

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      const res = await register(userInfo).unwrap();

      if (res?.success) {
        toast.success("User created successfully");
        navigate("/", { replace: true });
      } else {
        toast.success("User created successfully");
        navigate("/", { replace: true });
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Registration failed. Please try again.");
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
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
              <UserPlus className="h-6 w-6" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create your account</h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">Fill in your details to register and get started.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="text"
                          autoComplete="name"
                          placeholder="Arifur Rahman"
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

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="arif@example.com"
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Enter your password"
                          className={cn(FormStyles.input, "pl-9 pr-10")}
                          {...field}
                          value={field.value || ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Confirm your password"
                          className={cn(FormStyles.input, "pl-9 pr-10")}
                          {...field}
                          value={field.value || ""}
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
                    Creating account...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link to="/login" replace className="font-semibold text-violet-600 underline-offset-4 transition hover:underline dark:text-violet-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
