import Loading from "@/components/layout/Loading";
import { cn } from "@/lib/utils";
import { useGetSingleProjectQuery } from "@/redux/features/project/project.api";
import { useParams } from "react-router";
interface ProjectDetailsProps {
  className?: string;
}

const ProjectDetails = ({ className }: ProjectDetailsProps) => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleProjectQuery(id as string);

  const bgImage =
    data?.data?.data?.picture || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/christopher-gower-vjMgqUkS8q8-unsplash.jpg";

  if (isLoading) {
    return <Loading />;
  }

  const projectTitle = data?.data?.data?.title;
  const projectName = data?.data?.data?.name;
  const projectDescription = data?.data?.data?.description;
  const projectDetails = data?.data?.data?.details;
  // const projectStatus = data?.data?.data?.status;
  // const projectStartDate = data?.data?.data?.startDate;
  // const projectEndDate = data?.data?.data?.endDate;
  // const projectClient = data?.data?.data?.client;

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
          <h1 className="text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">{projectTitle}</h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8 text-left">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{projectName}</h2>
            <p className="text-xl leading-relaxed text-muted-foreground">{projectDescription}</p>
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="container">
          <div className="mx-auto prose prose-sm max-w-3xl dark:prose-invert">
            <h2>Creating Meaningful Digital Experiences</h2>
            <p>{projectDetails}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
