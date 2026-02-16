/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetClientsQuery } from "@/redux/features/client/client.api";
const ClientManagement = () => {
  const { data } = useGetClientsQuery(undefined);
  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      <Table className="border border-muted rounded-4xl">
        <TableCaption>A list of your recent invoices.</TableCaption>
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
              {/* <div>
               
              </div> */}
              <TableCell className="font-medium">{item?.name}</TableCell>
              <TableCell className="font-medium">{item?.email}</TableCell>
              <TableCell className="font-medium">{item?.phone}</TableCell>
              <TableCell className="font-medium">{item?.address}</TableCell>
              <TableCell className="font-medium">{item?.joinDate}</TableCell>

              <TableCell className="font-medium text-right space-x-2">
                <Button variant="outline">View</Button>
                <Button variant="outline">Edit</Button>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientManagement;
