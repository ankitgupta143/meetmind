import { z } from "zod";

export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters")
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters")
      .optional(),

    phone: z
      .string()
      .trim()
      .max(30, "Phone number cannot exceed 30 characters")
      .optional(),

    company: z
      .string()
      .trim()
      .max(100, "Company name cannot exceed 100 characters")
      .optional(),

    jobTitle: z
      .string()
      .trim()
      .max(100, "Job title cannot exceed 100 characters")
      .optional(),

    timezone: z
      .string()
      .trim()
      .max(100, "Timezone cannot exceed 100 characters")
      .optional(),

    country: z
      .string()
      .trim()
      .max(100, "Country cannot exceed 100 characters")
      .optional(),

    language: z
      .string()
      .trim()
      .max(20, "Language cannot exceed 20 characters")
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one profile field is required.",
    }
  );