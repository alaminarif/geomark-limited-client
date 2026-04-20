import Loading from "@/components/layout/Loading";
import SEO from "@/components/SEO";
import { createBreadcrumbSchema, createServiceSchema, truncateText } from "@/lib/seo";
import { useGetSingleServiceQuery } from "@/redux/features/service/service.api";
import { useParams } from "react-router";

const ServiceDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetSingleServiceQuery(id as string);
  const service = data?.data?.data;

  const bgImage = service?.picture || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/christopher-gower-vjMgqUkS8q8-unsplash.jpg";
  const serviceName = service?.name || "Service Details";
  const serviceDescription = service?.description || "Learn more about this Geomark Limited service sector.";
  const canonical = `/service/${id ?? ""}`;

  if (isLoading) {
    return (
      <>
        <SEO title="Service Details" description="Loading Geomark Limited service details." canonical={canonical} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <SEO
        title={serviceName}
        description={truncateText(serviceDescription)}
        image={bgImage}
        canonical={canonical}
        jsonLd={[
          createServiceSchema({
            name: serviceName,
            description: serviceDescription,
            image: bgImage,
            path: canonical,
          }),
          createBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: serviceName, path: canonical },
          ]),
        ]}
      />

      <section className="pb-32">
        {/* Full Width Hero with Background Image */}
        <div
          className="relative flex min-h-125 items-center justify-center bg-cover bg-center bg-no-repeat py-32"
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>

          <div className="relative z-10 container  text-center bg-black/25 backdrop-blur-md">
            <h1 className="text-xl  tracking-tighttext-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">{serviceName}</h1>
          </div>
        </div>

        {/* Intro Section */}
        <div className="py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl  space-y-8 text-left">
              <h2 className="text-3xl font-semibold  tracking-tight md:text-4xl">{serviceName}</h2>
              <p className="text-xl leading-relaxed text-muted-foreground">{serviceDescription}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetails;
