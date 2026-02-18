/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import Loading from "@/components/layout/Loading";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/features/user/user.api";
const UserManagement = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllUsersQuery(undefined);
  const [deleteUser] = useDeleteUserMutation();

  const handleDeleteUser = async (userId: string) => {
    const toastId = toast.loading("Deleting user...");

    try {
      const res = await deleteUser(userId).unwrap();

      if (res.success) {
        toast.success("User deleted successfully", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to delete user", { id: toastId });
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const handleRegisterUser = () => {
    navigate("/register"); // Render the Register component when the button is clicked
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <div className="flex justify-between my-5">
        <h1>User </h1>

        <div>
          <Button onClick={handleRegisterUser}>Add User</Button>
        </div>
      </div>

      <Table className="border border-muted rounded-4xl">
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead className="">Email</TableHead>
            <TableHead className="">Role</TableHead>
            <TableHead className="">Status</TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.data?.map((item: any) => (
            <TableRow className="">
              <TableCell className="font-medium">{item?.name}</TableCell>
              <TableCell className="font-medium">{item?.email}</TableCell>
              <TableCell className="font-medium">{item?.role}</TableCell>
              <TableCell className="font-medium">{item?.isActive}</TableCell>
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
                    <DeleteConfirmation onConfirm={() => handleDeleteUser(item._id)}>
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

export default UserManagement;
