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
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { useAddNewsMutation } from "@/redux/features/news/news.api";
import { motion } from "framer-motion";
import { FileText, ImagePlus, Loader2, Newspaper, PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AddNewsFormValues = {
  name: string;
  description?: string;
};

const defaultValues: AddNewsFormValues = {
  name: "",
  description: "",
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getErrorMessage = (error: any) => {
  return error?.data?.message || error?.data?.error || error?.error || error?.message || "Failed to add news";
};

export function AddNewsModal() {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<AddNewsFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const [addNews, { isLoading: isSubmitting }] = useAddNewsMutation();

  const handleClose = useCallback(() => {
    setOpen(false);
    form.reset(defaultValues);
    setImage(null);
  }, [form]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        handleClose();
        return;
      }
      setOpen(true);
    },
    [handleClose],
  );

  const onSubmit = async (data: AddNewsFormValues) => {
    if (image && image.size > MAX_IMAGE_SIZE) {
      toast.error(`News image must be smaller than ${formatFileSize(MAX_IMAGE_SIZE)}`);
      return;
    }

    const toastId = toast.loading("Adding news...");

    try {
      const newsData = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(newsData));

      if (image) {
        formData.append("file", image, image.name);
      }

      await addNews(formData).unwrap();

      toast.success("News added successfully", { id: toastId });
      handleClose();
    } catch (error: any) {
      toast.error(getErrorMessage(error), { id: toastId });
      console.log(error);
    }
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={handleOpenChange} direction="right">
        <DrawerTrigger asChild>
          <Button
            type="button"
            className="w-full rounded-2xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/30"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add News
          </Button>
        </DrawerTrigger>

        <DrawerContent className="ml-auto h-screen w-[65vw]! max-w-200! rounded-none border-l text-foreground shadow-[0_0_40px_rgba(0,0,0,0.45)] sm:w-[72vw]! lg:w-[56vw]! xl:w-[62vw]! dark:border-slate-800 dark:bg-slate-950">
          <DrawerHeader className="border-b border-purple-100 dark:border-slate-800 dark:bg-slate-950/95 dark:backdrop-blur">
            <div className="rounded-3xl border p-5 shadow-lg dark:border-slate-800 dark:bg-linear-to-r dark:from-violet-600/90 dark:via-indigo-600/90 dark:to-blue-600/90">
              <DrawerTitle className="text-2xl font-semibold text-foreground">Add New News</DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-foreground">Fill in news information, description and image.</DrawerDescription>
            </div>
          </DrawerHeader>

          <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Form {...form}>
                <form id="add-new-news" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                        <Newspaper className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">News Information</h3>
                        <p className="text-sm text-foreground/70">Basic news identity and summary details</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "News name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">News Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Newspaper className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input placeholder="Enter news name" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Description</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FileText className="pointer-events-none absolute left-3 top-4 h-4 w-4 text-foreground/60" />
                                <textarea
                                  placeholder="Enter news description"
                                  className={`${FormStyles.input} min-h-32 w-full resize-none py-3 pl-9`}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-amber-500/15 dark:text-amber-300">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">News Image</h3>
                        <p className="text-sm text-foreground/70">Upload news image if needed</p>
                      </div>
                    </div>

                    <div className={FormStyles.uploadCard}>
                      <SingleImageUploader onChange={setImage} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                      Keep the news image under {formatFileSize(MAX_IMAGE_SIZE)}.
                    </div>
                  </div>
                </form>
              </Form>
            </motion.div>
          </div>

          <DrawerFooter className="border-t dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                type="submit"
                form="add-new-news"
                disabled={isSubmitting}
                className="rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-md hover:opacity-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Submit News
                  </>
                )}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
