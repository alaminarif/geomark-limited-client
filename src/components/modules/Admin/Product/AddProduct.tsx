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
import MultipleImageUploader from "@/components/ui/MultipleImageUploader";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { Textarea } from "@/components/ui/textarea";
import { useAddProductMutation } from "@/redux/features/product/product.api";
import { addProductSchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";
import { BadgeDollarSign, Boxes, ImagePlus, Loader2, MapPin, PackagePlus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type UploadKind = "picture" | "gallery";

const MAX_SINGLE_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 8 * 1024 * 1024;

type AddProductFormValues = z.infer<typeof addProductSchema>;

const defaultValues: AddProductFormValues = {
  name: "",
  description: "",
  location: "",
  price: "",
  quantity: "",
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const canCompressImage = (file: File) => {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
};

const compressImageFile = async (file: File, kind: UploadKind) => {
  if (!canCompressImage(file)) {
    return file;
  }

  if (file.size <= 300 * 1024) {
    return file;
  }

  const options =
    kind === "picture"
      ? {
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          initialQuality: 0.82,
        }
      : {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1400,
          useWebWorker: true,
          initialQuality: 0.78,
        };

  const compressed = await imageCompression(file, options);

  return new File([compressed], file.name, {
    type: compressed.type || file.type,
    lastModified: Date.now(),
  });
};

const getErrorMessage = (error: any) => {
  return error?.data?.message || error?.data?.error || error?.error || error?.message || "Failed to add product";
};

const AddProductModal = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    mode: "onChange",
    defaultValues,
  });

  const [addProduct, { isLoading: isSubmitting }] = useAddProductMutation();

  const getTotalUploadSize = useCallback(() => {
    let total = 0;

    if (image) {
      total += image.size;
    }

    images.forEach((file) => {
      total += file.size;
    });

    return total;
  }, [image, images]);

  const validateUploads = useCallback(() => {
    if (!image) {
      return "Featured image is required";
    }

    if (image.size > MAX_SINGLE_FILE_SIZE) {
      return `Featured image must be smaller than ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`;
    }

    for (const file of images) {
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        return `Each gallery image must be smaller than ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`;
      }
    }

    const totalSize = getTotalUploadSize();

    if (totalSize > MAX_TOTAL_SIZE) {
      return `Total upload size is ${formatFileSize(totalSize)}. Maximum allowed is ${formatFileSize(MAX_TOTAL_SIZE)}`;
    }

    return null;
  }, [getTotalUploadSize, image, images]);

  const handleClose = useCallback(() => {
    setOpen(false);
    form.reset(defaultValues);
    setImage(null);
    setImages([]);
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

  const onSubmit = async (data: AddProductFormValues) => {
    const uploadError = validateUploads();

    if (uploadError) {
      toast.error(uploadError);
      return;
    }

    const toastId = toast.loading("Adding product...");

    try {
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        location: data.location?.trim() || "",
        price: Number(data.price),
        quantity: Number(data.quantity),
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));

      if (image) {
        const compressedPicture = await compressImageFile(image, "picture");
        formData.append("picture", compressedPicture, compressedPicture.name);
      }

      if (images.length > 0) {
        const compressedGallery = await Promise.all(images.map((file) => compressImageFile(file, "gallery")));

        compressedGallery.forEach((file) => {
          formData.append("gallery", file, file.name);
        });
      }

      await addProduct(formData).unwrap();

      toast.success("Product added successfully", { id: toastId });
      handleClose();
    } catch (error: any) {
      if (error?.status === 500 && error?.data?.err?.code === "LIMIT_UNEXPECTED_FILE") {
        toast.error("Upload field mismatch. Frontend must send picture and gallery.", { id: toastId });
        return;
      }

      if (error?.status === 413) {
        toast.error("Upload is too large. Please use smaller images.", { id: toastId });
        return;
      }

      if (error?.status === "FETCH_ERROR") {
        toast.error("Network error occurred. Please check your connection and backend settings.", { id: toastId });
        return;
      }

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
            <PackagePlus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </DrawerTrigger>

        <DrawerContent className="ml-auto h-screen w-[65vw]! max-w-300! rounded-none border-l text-foreground shadow-[0_0_40px_rgba(0,0,0,0.45)] sm:w-[72vw]! lg:w-[88vw]! xl:w-[82vw]! dark:border-slate-800 dark:bg-slate-950">
          <DrawerHeader className="border-b border-purple-100 dark:border-slate-800 dark:bg-slate-950/95 dark:backdrop-blur">
            <div className="rounded-3xl border p-5 shadow-lg dark:border-slate-800 dark:bg-linear-to-r dark:from-violet-600/90 dark:via-indigo-600/90 dark:to-blue-600/90">
              <DrawerTitle className="text-2xl font-semibold text-foreground">Add New Product</DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-foreground">
                Fill in the product details, inventory information and images.
              </DrawerDescription>
            </div>
          </DrawerHeader>

          <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Form {...form}>
                <form id="add-new-product" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                        <PackagePlus className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Product Information</h3>
                        <p className="text-sm text-foreground/70">Basic information about the product</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter product name" className={FormStyles.input} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">Description</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Write a short product description" className={FormStyles.textarea} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Location</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input placeholder="Enter product location" className={`${FormStyles.input} pl-8`} {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Boxes className="h-4 w-4 text-foreground/70" />
                          <p className="text-sm font-medium text-foreground">Quick Note</p>
                        </div>
                        <p className="mt-2 text-sm text-foreground/70">
                          Use a short product name, a clear description and the exact stock quantity for better inventory handling.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-blue-500/15 dark:text-violet-300">
                        <BadgeDollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Pricing & Stock</h3>
                        <p className="text-sm text-foreground/70">Set price and available quantity</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Price</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" placeholder="Enter product price" className={FormStyles.input} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="1" placeholder="Enter available quantity" className={FormStyles.input} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-emerald-500/15 dark:text-violet-300">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Product Images</h3>
                        <p className="text-sm text-foreground/60">Upload featured image and gallery images</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className={FormStyles.uploadCard}>
                        <p className="mb-3 text-sm font-medium text-foreground">Featured Image</p>
                        <SingleImageUploader onChange={setImage} />
                      </div>

                      <div className={FormStyles.uploadCard}>
                        <p className="mb-3 text-sm font-medium text-foreground/60">Gallery Images</p>
                        <MultipleImageUploader onChange={setImages} />
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                      Keep each image under {formatFileSize(MAX_SINGLE_FILE_SIZE)} and total upload under {formatFileSize(MAX_TOTAL_SIZE)}.
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
                  className="rounded-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                type="submit"
                form="add-new-product"
                disabled={isSubmitting}
                className="rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-md hover:opacity-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PackagePlus className="mr-2 h-4 w-4" />
                    Submit Product
                  </>
                )}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AddProductModal;
