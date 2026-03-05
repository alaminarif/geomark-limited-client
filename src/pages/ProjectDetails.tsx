import Loading from "@/components/layout/Loading";
import { cn } from "@/lib/utils";
import { useGetSingleProjectQuery } from "@/redux/features/project/project.api";
import { useParams } from "react-router";

import { faker } from "@faker-js/faker";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export const title = "Carousel with Thumbnails";

const slides = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  image: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
}));

const text =
  "GEOMARK LIMITED is a brand name with specific focus to the Planning and IT Enabled Services ITES specializing in the geospatial               applications including Advance topographical survey; consultancy on Engineering & Architectural Design, Drawing, Supervision, Planning, Software, Data Entry , Webpage Development GIS, CAD, LIS, MIS, AM FM, processing of remote sensing data, digital mapping/surveying using GPS, geo-spatial and textual data conversion, application software and web page; solutions development and so forth.";

interface ProjectDetailsProps {
  className?: string;
}

const ProjectDetails = ({ className }: ProjectDetailsProps) => {
  const { id } = useParams();

  const { data, isLoading } = useGetSingleProjectQuery(id as string);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const bgImage =
    data?.data?.data?.picture || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/christopher-gower-vjMgqUkS8q8-unsplash.jpg";

  if (isLoading) {
    return <Loading />;
  }

  const handleApiChange = (newApi: CarouselApi) => {
    setApi(newApi);

    if (newApi) {
      setCurrent(newApi.selectedScrollSnap());

      newApi.on("select", () => {
        setCurrent(newApi.selectedScrollSnap());
      });
    }
  };

  const projectTitle = data?.data?.data?.title;
  const projectName = data?.data?.data?.name;
  const projectDescription = data?.data?.data?.description;
  // const projectDetails = data?.data?.data?.details;
  // const projectStatus = data?.data?.data?.status;
  // const projectStartDate = data?.data?.data?.startDate;
  // const projectEndDate = data?.data?.data?.endDate;
  // const projectClient = data?.data?.data?.client;

  return (
    <section className={cn("pb-32", className)}>
      {/* Full Width Hero with Background Image */}
      <div
        className="relative flex min-h-125 items-center justify-center bg-cover bg-center bg-no-repeat py-32"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 container text-center">
          <h1 className="text-4xl font-medium tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">{projectTitle}</h1>
        </div>
      </div>

      {/* Intro Section */}
      <div className="py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-8 text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground dark:text-primary-foreground md:text-4xl">{projectName}</h2>
            <div className="leading-relaxed ">
              <h3 className="text-2xl font-semibold text-foreground dark:text-primary-foreground  ">Project Description: </h3>
              <div className="text-xl text-muted-foreground">{projectDescription}</div>
            </div>
            {/* Carousel */}
            <div className="h3">
              <div className="mx-auto w-full max-w-4xl space-y-4">
                <Carousel setApi={handleApiChange}>
                  <CarouselContent>
                    {slides.map((slide) => (
                      <CarouselItem key={slide.id}>
                        <div className="flex aspect-2/1 items-center justify-center rounded-md border bg-background">
                          <span className="text-4xl font-semibold">{slide.id}</span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>

                <div className="flex justify-center gap-2">
                  {slides.map((slide, index) => {
                    const isActive = current === index;

                    return (
                      <Button
                        key={slide.id}
                        onClick={() => api?.scrollTo(index)}
                        variant="outline" // let className control the look
                        className={[
                          // base
                          "inline-flex items-center justify-center rounded text-center font-medium",
                          "transition-all duration-300",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
                          // active vs inactive
                          isActive
                            ? "bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/40 scale-[1.03]"
                            : "bg-transparent text-muted-foreground border border-muted hover:text-white hover:border-transparent hover:bg-linear-to-r hover:from-purple-500/70 hover:to-blue-500/70",
                          // optional press feel
                          "active:scale-[0.98]",
                        ].join(" ")}
                        aria-current={isActive ? "true" : "false"}
                      >
                        {slide.id}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="container">
          <div className="mx-auto prose prose-sm max-w-4xl dark:prose-invert  mb-8">
            <h3 className="text-2xl font-semibold text-foreground dark:text-primary-foreground mb-4 ">Key Objectives:</h3>
            <ul className=" mx-auto prose prose-sm max-w-4xl  list-outside list-disc space-y-2  text-muted-foreground">
              {text
                .split(";")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((t, i) => (
                  <li key={i} className="ml-8">
                    {t}
                  </li>
                ))}
            </ul>
          </div>
          <div className="mx-auto prose prose-sm max-w-4xl dark:prose-invert mt-6">
            <h3 className="text-2xl font-semibold text-foreground dark:text-primary-foreground mb-4">Key Findings:</h3>
          </div>

          <ul className=" mx-auto prose prose-sm max-w-4xl  list-outside list-disc space-y-2  text-muted-foreground">
            {text
              .split(";")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((t, i) => (
                <li key={i} className="ml-8">
                  {t}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
