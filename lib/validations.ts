import { z } from "zod";

export const MAX_TITLE_LENGTH = 40;
export const MAX_CONTENT_LENGTH = 4000;

export const postSchema = z.object({
  title: z.string().min(1).max(MAX_TITLE_LENGTH),
  content: z.string().min(1).max(MAX_CONTENT_LENGTH),
});

export const MAX_COMMENT_LENGTH = 600;

export const commentSchema = z.object({
  content: z.string().min(1).max(MAX_CONTENT_LENGTH),
});

export const userSettingsSchema = z.object({
  id: z
    .string()
    .max(255)
    .regex(/^[a-zA-Z0-9_]+$/),
  name: z.string().max(255),
  email: z.string().email().max(255),
});
