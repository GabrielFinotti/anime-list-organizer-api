import z from "zod";

export const envSchema = z.object({
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  VERSION: z.string().min(1),
  MONGODB_URI: z
    .string()
    .url("MONGODB_URI deve ser uma URL válida")
    .refine(
      (uri) => uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"),
      "MONGODB_URI deve começar com 'mongodb://' ou 'mongodb+srv://'"
    ),
  OPENAI_API_KEY: z.string().min(1).optional().nullable(),
});

export type EnvSchema = z.infer<typeof envSchema>;
