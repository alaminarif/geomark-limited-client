import z from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const addProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  description: z.string().trim().min(1, "Description is required"),
  location: z.string().trim().optional(),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine((value: any) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: "Price must be a valid non-negative number",
    }),
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required")
    .refine((value: any) => Number.isInteger(Number(value)) && Number(value) >= 0, {
      message: "Quantity must be a valid non-negative integer",
    }),
});

export const updateProductSchema = z.object({
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
  location: z.string().trim().optional(),
  price: z
    .string()
    .trim()
    .optional()
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, { message: "Price must be a valid non-negative number" }),
  quantity: z
    .string()
    .trim()
    .optional()
    .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, { message: "Quantity must be a valid non-negative integer" }),
});
