/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import AddClientModal from "@/components/modules/Admin/Client/AddClientModal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteClientMutation, useGetClientsQuery } from "@/redux/features/client/client.api";
import { MoreHorizontalIcon } from "lucide-react";
const ClientManagement = () => {
  const { data } = useGetClientsQuery(undefined);
  const [deleteClient] = useDeleteClientMutation();

  const handleDeleteClient = async (clientId: string) => {
    const res = await deleteClient(clientId).unwrap();
    console.log(res);
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
              <TableCell className="font-medium">{item?.joinDate}</TableCell>

              <TableCell className="font-medium text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />

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
