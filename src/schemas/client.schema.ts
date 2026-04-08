import { z } from "zod";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

const optionalTextField = (label: string, maxLength = 255) =>
  z.preprocess(emptyStringToUndefined, z.string().trim().max(maxLength, `${label} cannot exceed ${maxLength} characters`).optional());

const optionalEmailField = z.preprocess(emptyStringToUndefined, z.string().trim().email("Please enter a valid email address").optional());

const optionalPhoneField = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().min(6, "Phone number must be at least 6 characters").max(20, "Phone number cannot exceed 20 characters").optional(),
);

const requiredDateField = z
  .preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    const parsedDate = new Date(value as string);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }, z.date().nullable())
  .refine((value) => value !== null, {
    message: "Join date is required",
  })
  .transform((value) => value as Date);

const optionalDateField = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  const parsedDate = new Date(value as string);
  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}, z.date().optional());

export const addClientSchema = z.object({
  name: z.string().trim().min(1, "Client name is required").max(100, "Client name cannot exceed 100 characters"),

  email: optionalEmailField,

  phone: optionalPhoneField,

  address: optionalTextField("Address", 300),

  joinDate: requiredDateField,
});

export const updateClientSchema = z.object({
  name: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "Client name is required").max(100, "Client name cannot exceed 100 characters").optional(),
  ),

  email: optionalEmailField,

  phone: optionalPhoneField,

  address: optionalTextField("Address", 300),

  joinDate: optionalDateField,
});

export type AddClientFormValues = z.infer<typeof addClientSchema>;
export type UpdateClientFormValues = z.infer<typeof updateClientSchema>;
