/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { useAddServiceMutation } from "@/redux/features/service/service.api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddServiceModal() {
  const form = useForm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [addService] = useAddServiceMutation();

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Adding service...");

    const formData = new FormData();

    formData.append("data", JSON.stringify(data));
    formData.append("file", image as File);
    try {
      await addService(formData).unwrap();
      toast.success("Service added successfully", { id: toastId });
      setOpen(false);
      form.reset();
      setImage(null);
    } catch (error) {
      toast.error("Failed to add service", { id: toastId });
      console.log(error);
    }
    console.log(data);
  };
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button>Add Service</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Service</DrawerTitle>
          <DrawerDescription>Fill in the details to add a new service.</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          <Form {...form}>
            <form id="add-new-service" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="pt-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <SingleImageUploader onChange={setImage} />
        </div>
        <DrawerFooter>
          <Button type="submit" form="add-new-service">
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
