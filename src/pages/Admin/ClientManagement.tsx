/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import Loading from "@/components/layout/Loading";
import AddClientModal from "@/components/modules/Admin/Client/AddClientModal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteClientMutation, useGetClientsQuery } from "@/redux/features/client/client.api";
import { format } from "date-fns";
import { MoreHorizontalIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
const ClientManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetClientsQuery(undefined);
  const [deleteClient] = useDeleteClientMutation();

  if (isLoading) {
    return <Loading />;
  }
  const handleDeleteClient = async (clientId: string) => {
    const toastId = toast.loading("Deleting client...");

    try {
      const res = await deleteClient(clientId).unwrap();

      if (res.success) {
        toast.success("Client deleted successfully", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to delete client", { id: toastId });
      console.log(error);
    }
  };

  const handleClientDetails = (id: string) => {
    navigate(`/client/${id}`);
    console.log("click", id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <div className="flex justify-between my-5">
        <h1>Client</h1>
        <AddClientModal />
      </div>

      <Table className="border border-muted rounded-4xl">
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead className="">Email</TableHead>
            <TableHead className="">Phone</TableHead>
            <TableHead className="">Address</TableHead>
            <TableHead className="">Join</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.data?.map((item: any) => (
            <TableRow className="">
              <TableCell className="font-medium">{item?.name}</TableCell>
              <TableCell className="font-medium">{item?.email}</TableCell>
              <TableCell className="font-medium">{item?.phone}</TableCell>
              <TableCell className="font-medium">{item?.address}</TableCell>
              <TableCell className="font-medium">{item?.joinDate ? format(new Date(item.joinDate), "PPP") : "-"}</TableCell>

              <TableCell className="font-medium text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleClientDetails(item?._id)}>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DeleteConfirmation onConfirm={() => handleDeleteClient(item._id)}>
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

export default ClientManagement;
