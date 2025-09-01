import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres.").max(100, "El título no puede tener más de 100 caracteres."),
  content: z.string().min(100, "El contenido debe tener al menos 100 caracteres."),
  imageUrl: z.string().url("Por favor, introduce una URL de imagen válida."),
  slug: z.string().regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones."),
  metaTitle: z.string().min(5, "El meta título es requerido.").max(70, "El meta título no debe exceder los 70 caracteres."),
  metaDescription: z.string().min(10, "La meta descripción es requerida.").max(160, "La meta descripción no debe exceder los 160 caracteres."),
  published: z.boolean().default(false),
});

export type BlogPostSchema = z.infer<typeof blogPostSchema>;
