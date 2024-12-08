import { z } from "zod";
export const CATEGORY_NAME = z
  .string()
  .min(1, { message: "category name is required" })
  .regex(/^[a-zA-Z0-9-]+$/, { message: "category name can only contain letter numbers or hyphens." });
