import { RegisterForm } from "@/components/modules/Authentication/RegisterForm";
import SEO from "@/components/SEO";

export default function RegisterPage() {
  return (
    <>
      <SEO title="Register" description="Create a Geomark Limited account." canonical="/register" noIndex />

      <div className="min-h-screen flex items-center justify-center w-full max-w-md mx-auto">
        <RegisterForm />
      </div>
    </>
  );
}
