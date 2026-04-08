/* eslint-disable @typescript-eslint/no-explicit-any */ import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addEmployeeSchema } from "@/schemas/employee.schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SingleImageUploader from "@/components/ui/SingleImageUploader";
import { cn } from "@/lib/utils";
import { useAddEmployeeMutation } from "@/redux/features/employee/employee.api";
import { format, formatISO } from "date-fns";
import { motion } from "framer-motion";
import { Briefcase, CalendarIcon, GraduationCap, ImagePlus, Loader2, Mail, MapPin, Phone, PlusCircle, Share2, User } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
type AddEmployeeFormValues = z.infer<typeof addEmployeeSchema>;
const defaultValues: AddEmployeeFormValues = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  address: "",
  institute: "",
  education: "",
  facebook: "",
  linkedin: "",
  twitter: "",
  joinDate: undefined as unknown as Date,
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
const getErrorMessage = (error: any) => {
  return error?.data?.message || error?.data?.error || error?.error || error?.message || "Failed to add employee";
};
const AddEmployeeModal = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const form = useForm<AddEmployeeFormValues>({ resolver: zodResolver(addEmployeeSchema), mode: "onChange", defaultValues });
  const [addEmployee, { isLoading: isSubmitting }] = useAddEmployeeMutation();
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
  const onSubmit = async (data: AddEmployeeFormValues) => {
    if (image && image.size > MAX_IMAGE_SIZE) {
      toast.error(`Profile image must be smaller than ${formatFileSize(MAX_IMAGE_SIZE)}`);
      return;
    }
    const toastId = toast.loading("Adding employee...");
    try {
      const employeeData = {
        name: data.name.trim(),
        email: data.email?.trim() || "",
        phone: data.phone?.trim() || "",
        designation: data.designation.trim(),
        address: data.address?.trim() || "",
        institute: data.institute?.trim() || "",
        education: data.education?.trim() || "",
        facebook: data.facebook?.trim() || "",
        linkedin: data.linkedin?.trim() || "",
        twitter: data.twitter?.trim() || "",
        joinDate: formatISO(data.joinDate),
      };
      const formData = new FormData();
      formData.append("data", JSON.stringify(employeeData));
      if (image) {
        formData.append("file", image, image.name);
      }
      await addEmployee(formData).unwrap();
      toast.success("Employee added successfully", { id: toastId });
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
            <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </DrawerTrigger>
        <DrawerContent className="ml-auto h-screen w-[65vw]! max-w-300! rounded-none border-l text-foreground shadow-[0_0_40px_rgba(0,0,0,0.45)] sm:w-[72vw]! lg:w-[88vw]! xl:w-[82vw]! dark:border-slate-800 dark:bg-slate-950">
          <DrawerHeader className="border-b border-purple-100 dark:border-slate-800 dark:bg-slate-950/95 dark:backdrop-blur">
            <div className="rounded-3xl border p-5 shadow-lg dark:border-slate-800 dark:bg-linear-to-r dark:from-violet-600/90 dark:via-indigo-600/90 dark:to-blue-600/90">
              <DrawerTitle className="text-2xl font-semibold text-foreground">Add New Employee</DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-foreground">
                Fill in employee information, joining details, social profiles and image.
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Form {...form}>
                <form id="add-new-employee" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className={FormStyles.section}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Personal Information</h3>
                        <p className="text-sm text-foreground/70">Basic employee identity and contact details</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input placeholder="Enter full name" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input
                                  placeholder="Enter email address"
                                  className={`${FormStyles.input} pl-9`}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Phone</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input placeholder="Enter phone number" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input placeholder="Enter address" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
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
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-blue-500/15 dark:text-blue-300">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Professional Information</h3>
                        <p className="text-sm text-foreground/70">Role, education and joining information</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Designation</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input placeholder="Enter designation" className={`${FormStyles.input} pl-9`} {...field} value={field.value ?? ""} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="joinDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-foreground">Join Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(FormStyles.dateButton, !field.value && "text-slate-400 dark:text-foreground/60")}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Pick join date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className={FormStyles.popoverContent} align="start">
                                <Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} captionLayout="dropdown" />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="institute"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Institute</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input
                                  placeholder="Enter institute name"
                                  className={`${FormStyles.input} pl-9`}
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Education</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/60" />
                                <Input
                                  placeholder="Enter education details"
                                  className={`${FormStyles.input} pl-9`}
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
                      <div className="rounded-2xl p-2.5 text-violet-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                        <Share2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">Social Profiles</h3>
                        <p className="text-sm text-foreground/70">Optional public profile links</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Facebook</FormLabel>
                            <FormControl>
                              <Input placeholder="Facebook profile link" className={FormStyles.input} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">LinkedIn</FormLabel>
                            <FormControl>
                              <Input placeholder="LinkedIn profile link" className={FormStyles.input} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Twitter</FormLabel>
                            <FormControl>
                              <Input placeholder="Twitter profile link" className={FormStyles.input} {...field} value={field.value ?? ""} />
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
                        <h3 className="text-base font-semibold text-foreground">Profile Image</h3>
                        <p className="text-sm text-foreground/70">Upload employee image if needed</p>
                      </div>
                    </div>
                    <div className={FormStyles.uploadCard}>
                      <SingleImageUploader onChange={setImage} />
                    </div>
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
                      Keep the profile image under {formatFileSize(MAX_IMAGE_SIZE)}.
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
                form="add-new-employee"
                disabled={isSubmitting}
                className="rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-md hover:opacity-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Submit Employee
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
export default AddEmployeeModal;
