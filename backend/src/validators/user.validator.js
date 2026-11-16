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
      .refine(
        (val) => val === "" || /^\+?[\d\s\-().]{7,30}$/.test(val),
        { message: "Please enter a valid phone number." }
      )
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

export const updateSettingsSchema = z
  .object({
    appearance: z
      .object({
        theme: z.enum(["light", "dark", "system"]).optional(),
        accentColor: z.string().trim().max(30).optional(),
        animations: z.boolean().optional(),
        compactView: z.boolean().optional(),
      })
      .strict()
      .optional(),

    localization: z
      .object({
        language: z.string().trim().max(20).optional(),
        timezone: z.string().trim().max(100).optional(),
      })
      .strict()
      .optional(),

    notifications: z
      .object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        inApp: z.boolean().optional(),
        meetingReady: z.boolean().optional(),
        summaryReady: z.boolean().optional(),
        mentions: z.boolean().optional(),
        weeklyDigest: z.boolean().optional(),
        workspaceUpdates: z.boolean().optional(),
      })
      .strict()
      .optional(),

    ai: z
      .object({
        model: z.string().trim().max(50).optional(),
        summaryStyle: z.enum(["short", "balanced", "detailed"]).optional(),
        responseTone: z.enum(["professional", "friendly", "concise"]).optional(),
        autoSummary: z.boolean().optional(),
        autoActionItems: z.boolean().optional(),
        autoDecisions: z.boolean().optional(),
        autoAnalytics: z.boolean().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one settings field must be provided.",
    }
  );
