import Loading from "@/components/layout/Loading";
import { cn } from "@/lib/utils";
import { useGetSingleServiceQuery } from "@/redux/features/service/service.api";
import { useParams } from "react-router";
interface ServiceDetailsProps {
  className?: string;
}

const ServiceDetails = ({ className }: ServiceDetailsProps) => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleServiceQuery(id as string);

  const bgImage =
    data?.data?.data?.picture || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/christopher-gower-vjMgqUkS8q8-unsplash.jpg";

  if (isLoading) {
    return <Loading />;
  }

  const serviceName = data?.data?.data?.name;
  const serviceDescription = data?.data?.data?.description;

  console.log(data.data);
  console.log(data?.data?.data?.name);

  return (
    <section className={cn("pb-32", className)}>
      {/* Full Width Hero with Background Image */}
      <div
        className="relative flex min-h-[500px] items-center justify-center bg-cover bg-center bg-no-repeat py-32"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 container text-center">
          <h1 className="text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">{serviceName}</h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8 text-left">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">User-Centered Design That Converts</h2>
            <p className="text-xl leading-relaxed text-muted-foreground">{serviceDescription}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;
