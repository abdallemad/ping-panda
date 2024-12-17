import { z } from "zod";
export const CATEGORY_NAME_VALIDATOR = z
  .string()
  .min(1, { message: "category name is required" })
  .regex(/^[a-zA-Z0-9-]+$/, {
    message: "category name can only contain letter numbers or hyphens.",
  });
export const EVENT_CATEGORY_VALIDATION = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z.string().regex(/^#([0-9A-F]{6})$/i, { message: "invalid color" }),
  emoji: z.string().emoji({ message: "invalid emoji" }).optional(),
});
export type EVENT_CATEGORY_VALIDATION = z.infer<
  typeof EVENT_CATEGORY_VALIDATION
>;
