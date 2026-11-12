import { z } from "zod";

export const updateMeetingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Meeting title cannot be empty")
    .max(200, "Meeting title cannot exceed 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Meeting description cannot exceed 2000 characters")
    .optional(),

  meetingDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please provide a valid meeting date.",
    })
    .optional(),

  durationSeconds: z
    .number()
    .min(0, "Duration cannot be negative")
    .optional(),

  participants: z
    .array(
      z.union([
        z.string().trim(),
        z.object({
          name: z.string().trim().max(100).optional(),
          email: z
            .string()
            .trim()
            .email("Invalid participant email")
            .or(z.literal(""))
            .optional(),
        }),
      ])
    )
    .optional(),

  isFavorite: z.boolean().optional(),

  isPinned: z.boolean().optional(),

  status: z.enum(["draft", "ready", "archived", "deleted"]).optional(),
}).strict();

export const assistantMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(2000, "Message cannot exceed 2000 characters"),
}).strict();
