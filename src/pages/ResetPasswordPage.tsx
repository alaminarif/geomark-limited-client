import { ResetPasswordForm } from "@/components/modules/Authentication/ResetPasswordForm";
import SEO from "@/components/SEO";

export default function ResetPasswordPage() {
  return (
    <>
      <SEO title="Reset Password" description="Set a new Geomark Limited account password." canonical="/reset-password" noIndex />

      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </>
  );
}
