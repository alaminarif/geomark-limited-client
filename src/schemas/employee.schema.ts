import { z } from "zod";

const optionalText = z.string().trim().optional();

const optionalEmail = z.union([z.string().trim().email("Invalid email"), z.literal("")]).optional();

const optionalUrl = z.union([z.string().trim().url("Invalid URL"), z.literal("")]).optional();

export const addEmployeeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: optionalEmail,
  phone: optionalText,
  designation: z.string().trim().min(1, "Designation is required"),
  rank: z.string().trim().min(1, "rank is required"),
  address: optionalText,
  institute: optionalText,
  education: optionalText,
  facebook: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  joinDate: z.date({
    error: "Join date is required",
  }),
});

export const updateEmployeeSchema = z.object({
  name: optionalText,
  email: optionalEmail,
  phone: optionalText,
  designation: optionalText,
  rank: optionalText,
  address: optionalText,
  institute: optionalText,
  education: optionalText,
  facebook: optionalUrl,
  linkedin: optionalUrl,
  twitter: optionalUrl,
  joinDate: z.date().optional(),
});
