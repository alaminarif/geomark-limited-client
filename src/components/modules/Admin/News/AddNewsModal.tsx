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
import { useAddNewsMutation } from "@/redux/features/news/news.api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function AddNewsModal() {
  const form = useForm();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [addNews] = useAddNewsMutation();

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Adding service...");

    const formData = new FormData();

    formData.append("data", JSON.stringify(data));
    formData.append("file", image as File);
    try {
      await addNews(formData).unwrap();
      toast.success("News added successfully", { id: toastId });
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
        <Button className="w-full rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
          Add News
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New News</DrawerTitle>
          <DrawerDescription>Fill in the details to add a new News.</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          <Form {...form}>
            <form id="add-new-news" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FormItem className="mt-4">
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
          <Button type="submit" form="add-new-news">
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
