import { ForgotPasswordForm } from "@/components/modules/Authentication/ForgotPasswordForm";
import SEO from "@/components/SEO";

export default function ForgotPasswordPage() {
  return (
    <>
      <SEO title="Forgot Password" description="Reset access to your Geomark Limited account." canonical="/forgot-password" noIndex />

      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
