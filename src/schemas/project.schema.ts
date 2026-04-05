import z from "zod";

export const addProjectSchema = z
  .object({
    service: z.string().trim().min(1, "Service is required"),
    name: z.string().trim().min(1, "Project name is required"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    objective: z.string().trim().min(5, "Objective is required").optional(),
    responsibility: z.string().trim().min(5, "Responsibility is required").optional(),
    status: z.string().trim().min(1, "Status is required"),
    startDate: z.date({ message: "Start date is required" }),
    endDate: z.date().nullable().optional(),
    location: z.string().trim().min(2, "Location is required"),
    client: z.string().trim().min(1, "Client is required"),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: "End date cannot be earlier than start date",
      path: ["endDate"],
    },
  );
export const updateProjectSchema = z
  .object({
    service: z.string().optional(),
    name: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    objective: z.string().optional(),
    responsibility: z.string().optional(),
    status: z.string().optional(),
    startDate: z.date({ message: "Start date is required" }).optional(),
    endDate: z.date().nullable().optional(),
    location: z.string().optional(),
    client: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.endDate || !data.startDate) return true;
      return data.endDate >= data.startDate;
    },
    { message: "End date cannot be earlier than start date", path: ["endDate"] },
  );
