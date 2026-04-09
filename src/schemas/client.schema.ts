import { z } from "zod";

export const addClientSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(100, "Client name cannot exceed 100 characters"),

  email: z.union([z.string().trim().email("Please enter a valid email address"), z.literal(""), z.undefined()]).optional(),

  phone: z
    .union([
      z.string().trim().min(6, "Phone number must be at least 6 characters").max(20, "Phone number cannot exceed 20 characters"),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),

  address: z.union([z.string().trim().max(300, "Address cannot exceed 300 characters"), z.literal(""), z.undefined()]).optional(),

  joinDate: z.date().refine((value) => value instanceof Date && !Number.isNaN(value.getTime()), {
    message: "Join date is required",
  }),
});

export const updateClientSchema = z.object({
  name: z
    .union([z.string().trim().min(1, "Client name is required").max(100, "Client name cannot exceed 100 characters"), z.literal(""), z.undefined()])
    .optional(),

  email: z.union([z.string().trim().email("Please enter a valid email address"), z.literal(""), z.undefined()]).optional(),

  phone: z
    .union([
      z.string().trim().min(6, "Phone number must be at least 6 characters").max(20, "Phone number cannot exceed 20 characters"),
      z.literal(""),
      z.undefined(),
    ])
    .optional(),

  address: z.union([z.string().trim().max(300, "Address cannot exceed 300 characters"), z.literal(""), z.undefined()]).optional(),

  joinDate: z.date().optional(),
});

export type AddClientFormValues = z.infer<typeof addClientSchema>;
export type UpdateClientFormValues = z.infer<typeof updateClientSchema>;
