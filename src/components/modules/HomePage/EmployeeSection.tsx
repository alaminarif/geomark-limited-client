/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
import Loading from "@/components/layout/Loading";
import { Facebook, Linkedin, Twitter } from "lucide-react";

export const EmployeeSection = ({
  heading = "Team",
  description = "Our diverse team of experts brings together decades of experience in design, engineering, and product development.",
}) => {
  const { data, isLoading } = useGetAllEmployeesQuery(undefined);
  console.log(data?.data);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className={cn("py-32")}>
      <div className="container flex flex-col items-center text-center">
        <h2 className="my-6 text-2xl font-bold text-pretty lg:text-4xl">{heading}</h2>
        <p className="mb-8 max-w-3xl text-muted-foreground lg:text-xl">{description}</p>
      </div>
      <div className="container mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {data?.data?.map((member: any) => (
          <div key={member.id} className="flex flex-col items-center">
            <Avatar className="mb-4 size-20 border md:mb-5 lg:size-24">
              <AvatarImage src={member?.picture} />
              <AvatarFallback>{member?.name}</AvatarFallback>
            </Avatar>
            <p className="text-center font-medium">{member.name}</p>
            <p className="text-center text-muted-foreground">{member.designation}</p>
            <div className="flex gap-3 mt-4">
              <a href="" className="rounded-lg bg-muted/50 p-2">
                <Facebook className="size-4 text-muted-foreground" />
              </a>

              <a href="" className="rounded-lg bg-muted/50 p-2 mx-auto ">
                <Linkedin className="size-4 text-muted-foreground" />
              </a>
              <a href="" className="rounded-lg bg-muted/50 p-2">
                <Twitter className="size-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp";
// "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp";
