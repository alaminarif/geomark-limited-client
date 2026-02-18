/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import Loading from "@/components/layout/Loading";
import { AddServiceModal } from "@/components/modules/Admin/Service/AddServiceModal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteServiceMutation, useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { MoreHorizontalIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
const ServicesManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllServicesQuery(undefined);
  const [deleteService] = useDeleteServiceMutation();

  if (isLoading) {
    return <Loading />;
  }
  const handleDeleteService = async (clientId: string) => {
    const toastId = toast.loading("Deleting service...");

    try {
      const res = await deleteService(clientId).unwrap();

      if (res.success) {
        toast.success("Service deleted successfully", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to delete service", { id: toastId });
      console.log(error);
    }
  };

  const handleServiceDetails = (id: string) => {
    navigate(`/service/${id}`);
    console.log("click", id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <div className="flex justify-between my-5">
        <h1>Services</h1>
        <AddServiceModal />
      </div>

      <Table className="border border-muted rounded-4xl">
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead className="">Description</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.data?.map((item: any) => (
            <TableRow className="">
              <TableCell className="font-medium">{item?.name}</TableCell>
              <TableCell className="font-medium">{item?.description}</TableCell>
              <TableCell className="font-medium text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleServiceDetails(item?._id)}>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DeleteConfirmation onConfirm={() => handleDeleteService(item._id)}>
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

export default ServicesManagement;
