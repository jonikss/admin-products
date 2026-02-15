import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Обязательное поле"),
  password: z.string().min(1, "Обязательное поле"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
