/* eslint-disable @typescript-eslint/no-explicit-any */ import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormStyles } from "@/components/ui/FormStyles";
import { Input } from "@/components/ui/input";
import MultipleImageUploader from "@/components/ui/MultipleImageUploader";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { Textarea } from "@/components/ui/textarea";
import { useGetSingleProductQuery, useUpdateProductMutation } from "@/redux/features/product/product.api";
import { updateProductSchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeDollarSign, Boxes, ImagePlus, Loader2, MapPin, PackageOpen, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
type UploadKind = "picture" | "gallery";
const MAX_SINGLE_FILE_SIZE = 2 * 1024 * 1024;
const MAX_TOTAL_SIZE = 8 * 1024 * 1024;

type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
const defaultValues: UpdateProductFormValues = { name: "", description: "", location: "", price: "", quantity: "" };
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
const safeString = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};
const getImageUrl = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?.url || value?.secure_url || value?.path || "";
};
const extractProduct = (payload: any) => {
  return payload?.data?.data || payload?.data?.product || payload?.product || payload?.data || payload || null;
};
const canCompressImage = (file: File) => {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
};
const compressImageFile = async (file: File, kind: UploadKind) => {
  if (!canCompressImage(file)) return file;
  if (file.size <= 300 * 1024) return file;
  const options =
    kind === "picture"
      ? { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true, initialQuality: 0.82 }
      : { maxSizeMB: 0.8, maxWidthOrHeight: 1400, useWebWorker: true, initialQuality: 0.78 };
  const compressed = await imageCompression(file, options);
  return new File([compressed], file.name, { type: compressed.type || file.type, lastModified: Date.now() });
};
const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageRef = useRef<File | null>(null);
  const imagesRef = useRef<File[]>([]);
  const setImage = useCallback((file: File | null) => {
    imageRef.current = file;
  }, []);
  const setImages = useCallback((files: File[]) => {
    imagesRef.current = files;
  }, []);
  const initialDataRef = useRef<Record<string, any> | null>(null);
  const initializedKeyRef = useRef("");
  const form = useForm<UpdateProductFormValues>({ resolver: zodResolver(updateProductSchema), mode: "onChange", defaultValues });
  const { data: productData, isLoading: productLoading, isFetching: productFetching } = useGetSingleProductQuery(id, { skip: !id });
  const [updateProduct, { isLoading: isSubmitting }] = useUpdateProductMutation();
  const product = useMemo(() => extractProduct(productData), [productData]);
  const existingThumbnail = useMemo(() => {
    return getImageUrl(product?.picture) || getImageUrl(product?.image) || getImageUrl(product?.thumbnail) || getImageUrl(product?.file) || "";
  }, [product]);

  const existingGallery = useMemo(() => {
    if (Array.isArray(product?.gallery)) return product.gallery.map(getImageUrl).filter(Boolean);
    if (Array.isArray(product?.images)) return product.images.map(getImageUrl).filter(Boolean);
    if (Array.isArray(product?.files)) return product.files.map(getImageUrl).filter(Boolean);
    return [];
  }, [product]);

  const serializeForSubmit = useCallback((values: UpdateProductFormValues) => {
    return {
      name: safeString(values.name),
      description: safeString(values.description),
      location: safeString(values.location),
      price: Number(values.price),
      quantity: Number(values.quantity),
    };
  }, []);

  useEffect(() => {
    initializedKeyRef.current = "";
    initialDataRef.current = null;
    form.reset(defaultValues);
    imageRef.current = null;
    imagesRef.current = [];
  }, [id, form]);

  useEffect(() => {
    if (!product) return;
    const initKey = [id || "", safeString(product?._id)].join("|");
    if (initializedKeyRef.current === initKey) return;
    const formattedValues: UpdateProductFormValues = {
      name: safeString(product?.name),
      description: safeString(product?.description),
      location: safeString(product?.location),
      price: safeString(product?.price),
      quantity: safeString(product?.quantity),
    };

    form.reset(formattedValues);
    initialDataRef.current = serializeForSubmit(formattedValues);
    initializedKeyRef.current = initKey;
  }, [id, product, form, serializeForSubmit]);

  const getTotalUploadSize = useCallback(() => {
    let total = 0;
    if (imageRef.current) total += imageRef.current.size;
    imagesRef.current.forEach((file) => {
      total += file.size;
    });
    return total;
  }, []);

  const validateUploads = useCallback(() => {
    if (imageRef.current && imageRef.current.size > MAX_SINGLE_FILE_SIZE) {
      return `Featured image must be smaller than ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`;
    }
    for (const file of imagesRef.current) {
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        return `Each gallery image must be smaller than ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`;
      }
    }
    const totalSize = getTotalUploadSize();
    if (totalSize > MAX_TOTAL_SIZE) {
      return `Total upload size is ${formatFileSize(totalSize)}. Maximum allowed is ${formatFileSize(MAX_TOTAL_SIZE)}`;
    }
    return null;
  }, [getTotalUploadSize]);

  const getErrorMessage = (error: any) => {
    return error?.data?.message || error?.data?.error || error?.error || error?.message || "Failed to update product";
  };
  const onSubmit = async (data: UpdateProductFormValues) => {
    if (!id) {
      toast.error("Product ID not found");
      return;
    }
    const uploadError = validateUploads();
    if (uploadError) {
      toast.error(uploadError);
      return;
    }
    const toastId = toast.loading("Updating product...");
    try {
      const normalizedData = serializeForSubmit(data);
      const changedData: Record<string, any> = {};
      Object.entries(normalizedData).forEach(([key, value]) => {
        const oldValue = initialDataRef.current?.[key];
        if (oldValue !== value) {
          changedData[key] = value;
        }
      });
      const hasNewThumbnail = !!imageRef.current;
      const hasNewGallery = imagesRef.current.length > 0;
      if (Object.keys(changedData).length === 0 && !hasNewThumbnail && !hasNewGallery) {
        toast.info("No changes detected", { id: toastId });
        return;
      }
      const formData = new FormData();

      formData.append("data", JSON.stringify(changedData));
      if (imageRef.current) {
        const compressedPicture = await compressImageFile(imageRef.current, "picture");
        formData.append("picture", compressedPicture, compressedPicture.name);
      }
      if (imagesRef.current.length > 0) {
        const compressedGallery = await Promise.all(imagesRef.current.map((file) => compressImageFile(file, "gallery")));
        compressedGallery.forEach((file) => {
          formData.append("gallery", file, file.name);
        });
      }
      await updateProduct({ id, data: formData }).unwrap();
      toast.success("Product updated successfully", { id: toastId });
      navigate(-1);
    } catch (error: any) {
      if (error?.status === 500 && error?.data?.err?.code === "LIMIT_UNEXPECTED_FILE") {
        toast.error("Upload field mismatch. Frontend must send picture and gallery.", { id: toastId });
        return;
      }
      if (error?.status === 413) {
        toast.error("Upload is still too large. Please use smaller images.", { id: toastId });
        return;
      }
      if (error?.status === "FETCH_ERROR") {
        toast.error("Network error occurred. Please check your connection and backend settings.", { id: toastId });
        return;
      }
      toast.error(getErrorMessage(error), { id: toastId });
    }
  };
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit(onSubmit)(event);
  };
  if (productLoading || productFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="flex items-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Loading product...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-purple-50 via-white to-blue-50 px-4 py-6 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-7xl min-w-0 space-y-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-xl border-purple-200 bg-white text-slate-700 hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <div className="rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-2 text-foreground">
              <h1 className="text-2xl font-semibold">Update Product</h1>
              <p className="mt-1 text-sm">Edit product details, stock information and images.</p>
            </div>
          </div>
          <Button
            type="submit"
            form="update-product-form"
            disabled={isSubmitting}
            className="rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-2 text-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
        <Form {...form}>
          <form id="update-product-form" onSubmit={handleFormSubmit} className="min-w-0 space-y-5">
            <div className={FormStyles.section}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-purple-100 p-2.5 text-purple-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <PackageOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-foreground">Product Information</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update the basic information about the product</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-foreground">Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" className={FormStyles.input} {...field} value={field.value ?? ""} />
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
                        <FormLabel className="text-slate-700 dark:text-foreground">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a short product description"
                            className={FormStyles.textarea}
                            {...field}
                            value={field.value ?? ""}
                          />
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
                      <FormLabel className="text-slate-700 dark:text-foreground">Location</FormLabel>
                      <FormControl>
                        <div className="relative min-w-0 w-full">
                          <MapPin className="pointer-events-none absolute left-3 top-1/3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-foreground/60" />
                          <Input placeholder="Enter product location" className={`${FormStyles.input} pl-8`} {...field} value={field.value ?? ""} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="rounded-2xl border border-dashed border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Boxes className="h-4 w-4 text-foreground/70" /> <p className="text-sm font-medium text-foreground">Quick Note</p>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70">Keep product name clear, quantity accurate and description short but useful.</p>
                </div>
              </div>
            </div>
            <div className={FormStyles.section}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                  <BadgeDollarSign className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-foreground">Pricing & Stock</h3>
                  <p className="text-sm text-slate-500 dark:text-muted-foreground">Update price and available quantity</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-foreground">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter product price"
                          className={FormStyles.input}
                          {...field}
                          value={field.value ?? ""}
                        />
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
                      <FormLabel className="text-slate-700 dark:text-foreground">Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Enter available quantity"
                          className={FormStyles.input}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className={FormStyles.section}>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <ImagePlus className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-foreground">Product Images</h3>
                  <p className="text-sm text-slate-500 dark:text-foreground/60">
                    Current images are shown below. Upload new ones if you want to replace or add more.
                  </p>
                </div>
              </div>
              {(existingThumbnail || existingGallery.length > 0) && (
                <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {existingThumbnail && (
                    <div className={FormStyles.uploadCard}>
                      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">Current Featured Image</p>
                      <img
                        src={existingThumbnail}
                        alt="Current featured"
                        className="h-48 w-full rounded-2xl border border-purple-100 object-cover dark:border-slate-700"
                      />
                    </div>
                  )}
                  {existingGallery.length > 0 && (
                    <div className={FormStyles.uploadCard}>
                      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">Current Gallery</p>
                      <div className="grid grid-cols-2 gap-3">
                        {existingGallery.map((img: string, index: number) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Gallery ${index + 1}`}
                            className="h-24 w-full rounded-2xl border border-purple-100 object-cover dark:border-slate-700"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className={FormStyles.uploadCard}>
                  <p className="mb-3 text-sm font-medium text-slate-700 dark:text-foreground">New Featured Image</p>
                  <SingleImageUploader onChange={setImage} />
                </div>
                <div className={FormStyles.uploadCard}>
                  <p className="mb-3 text-sm font-medium text-slate-600 dark:text-foreground/60">New Gallery Images</p>
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                Keep each image under {formatFileSize(MAX_SINGLE_FILE_SIZE)} and total upload under {formatFileSize(MAX_TOTAL_SIZE)}.
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="rounded-xl border-purple-200 bg-white text-slate-700 hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-3xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-2 text-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Update Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
};
export default UpdateProduct;
