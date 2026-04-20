// import Logo from "@/assets/images/Geomark_Logo_png.png";
import { LoginForm } from "@/components/modules/Authentication/LoginForm";
import SEO from "@/components/SEO";

export default function Login() {
  return (
    <>
      <SEO title="Login" description="Log in to Geomark Limited." canonical="/login" noIndex />

      <div className="min-h-screen flex items-center justify-center w-full max-w-md mx-auto">
        <LoginForm />
      </div>
    </>
  );
}
