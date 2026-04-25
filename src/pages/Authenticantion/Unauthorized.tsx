import SEO from "@/components/SEO";

const Unauthorized = () => {
  return (
    <>
      <SEO title="Unauthorized" description="Unauthorized access to Geomark Limited." canonical="/unauthorized" noIndex />

      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-semibold">Unauthorized Access</h1>
      </div>
    </>
  );
};

export default Unauthorized;
