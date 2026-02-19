/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import Loading from "@/components/layout/Loading";
import AddProjectModal from "@/components/modules/Admin/Project/AddProjectModal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteProjectMutation, useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { format } from "date-fns";
import { MoreHorizontalIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
const ProjectManagement = () => {
  const navigate = useNavigate();

  const { data: projectsData, isLoading: projectsLoading } = useGetAllProjectsQuery(undefined);
  const [deleteProject] = useDeleteProjectMutation();

  if (projectsLoading) {
    return <Loading />;
  }

  const handleDeleteProject = async (projectId: string) => {
    const toastId = toast.loading("Deleting project...");

    try {
      const res = await deleteProject(projectId).unwrap();

      if (res.success) {
        toast.success("Project deleted successfully", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to delete project", { id: toastId });
      console.log(error);
    }
  };
  const handleProjectDetails = (id: string) => {
    navigate(`/project/${id}`);
    console.log("click", id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <div className="flex justify-between my-5">
        <h1>Project</h1>
        <AddProjectModal />
      </div>

      <Table className="border border-muted rounded-4xl">
        <TableHeader>
          <TableRow>
            <TableHead className="">Title</TableHead>
            <TableHead className="">Name</TableHead>
            {/* <TableHead className="">Description</TableHead>
            <TableHead className="">Details</TableHead> */}
            <TableHead className="">Status</TableHead>
            <TableHead className="">Start Date</TableHead>
            <TableHead className="">End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {projectsData?.data?.map((item: any) => (
            <TableRow className="">
              <TableCell className="font-medium">{item?.title}</TableCell>
              <TableCell className="font-medium">{item?.name}</TableCell>
              {/* <TableCell className="font-medium">{item?.description}</TableCell>
              <TableCell className="font-medium">{item?.details}</TableCell> */}
              <TableCell className="font-medium">{item?.status}</TableCell>
              <TableCell className="font-medium">{item?.startDate ? format(new Date(item.startDate), "PPP") : "-"}</TableCell>
              <TableCell className="font-medium">{item?.endDate ? format(new Date(item.endDate), "PPP") : "-"}</TableCell>

              <TableCell className="font-medium text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleProjectDetails(item?._id)}>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DeleteConfirmation onConfirm={() => handleDeleteProject(item._id)}>
                      <Button variant="outline" className="text-destructive">
                        Delete
                      </Button>
                    </DeleteConfirmation>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectManagement;
