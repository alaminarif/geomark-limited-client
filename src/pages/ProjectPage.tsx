/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layout/Loading";
import ProjectFilter from "@/components/modules/Project/ProjectFilter";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useNavigate, useSearchParams } from "react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const ProjectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const title = searchParams.get("title") || undefined;

  const { data: projects, isLoading } = useGetAllProjectsQuery({ title });
  // const TServiceOtions =

  // console.log("servieOption", serviceOptions);
  if (isLoading) {
    return <Loading />;
  }
  const handleProjectDetails = (id: string) => {
    navigate(`/project/${id}`);
  };
  return (
    <section className="container mx-auto">
      <div>
        <div className="">
          <ProjectFilter />
        </div>
        <Table className="border border-muted rounded-4xl">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Image</TableHead>
              <TableHead className="text-center">Project Name</TableHead>
              <TableHead className="text-center">Period</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Sector</TableHead>
              <TableHead className="text-center">Client</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects?.data?.map((item: any) => (
              <TableRow className="">
                <TableCell className="font-medium">
                  <div className="">
                    <img src={item.picture} className="w-25 h-20 rounded-xl" />
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  <p className="font-medium whitespace-normal wrap-break-word">{item.name}</p>
                </TableCell>

                <TableCell className="font-medium">
                  <p>{item?.startDate ? format(new Date(item.startDate), "PPP") : "-"}</p>
                </TableCell>

                <TableCell className="font-medium">
                  <p>{item.status}</p>
                </TableCell>

                <TableCell className="font-medium">
                  <p className="font-medium whitespace-normal wrap-break-word">{item.title}</p>
                </TableCell>

                <TableCell className="font-medium">
                  <p>{item?.client?.name}</p>
                </TableCell>
                <TableCell className="font-medium text-right">
                  <Button onClick={() => handleProjectDetails(item?._id)} variant="outline" className="text-destructive">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ProjectPage;
