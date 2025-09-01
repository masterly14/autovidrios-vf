"use server";

import db from "@/lib/db";
import { blogPostSchema } from "@/lib/validations/blog";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>;
}

export async function createBlogPost(prevState: FormState, formData: FormData): Promise<FormState> {
    
    const rawFormData = Object.fromEntries(formData.entries());

    // Convertir 'published' a boolean
    const dataToValidate = {
        ...rawFormData,
        published: rawFormData.published === 'on',
    };
    
    const validationResult = blogPostSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
        return {
            success: false,
            message: "Error de validación. Por favor, revisa los campos.",
            errors: validationResult.error.flatten().fieldErrors,
        }
    }

    const data = validationResult.data;

    try {
        // Verificar si el slug ya existe
        const existingPost = await db.blogPost.findUnique({
            where: { slug: data.slug },
        });

        if (existingPost) {
            return {
                success: false,
                message: "Error: La URL amigable (slug) ya está en uso. Por favor, elige una diferente.",
                errors: { slug: ["Este slug ya existe."] }
            }
        }
        
        await db.blogPost.create({
            data: {
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl,
                slug: data.slug,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                published: data.published,
            }
        });

    } catch (error) {
        console.error("Error al crear el post:", error);
        return {
            success: false,
            message: "Error inesperado en el servidor. Por favor, inténtalo de nuevo."
        }
    }
    
    // Invalidar caché para que las páginas se actualicen
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);

    // Redirigir a la página del nuevo post
    redirect(`/blog/${data.slug}`);
}


export async function updateBlogPost(postId: number, prevState: FormState, formData: FormData): Promise<FormState> {
    
    const rawFormData = Object.fromEntries(formData.entries());

    const dataToValidate = {
        ...rawFormData,
        published: rawFormData.published === 'on',
    };
    
    const validationResult = blogPostSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
        return {
            success: false,
            message: "Error de validación. Por favor, revisa los campos.",
            errors: validationResult.error.flatten().fieldErrors,
        }
    }

    const data = validationResult.data;

    try {
        const existingPost = await db.blogPost.findFirst({
            where: { 
                slug: data.slug,
                id: { not: postId } // Excluir el post actual de la búsqueda
            },
        });

        if (existingPost) {
            return {
                success: false,
                message: "Error: La URL amigable (slug) ya está en uso en otro artículo.",
                errors: { slug: ["Este slug ya existe."] }
            }
        }
        
        await db.blogPost.update({
            where: { id: postId },
            data: {
                title: data.title,
                content: data.content,
                imageUrl: data.imageUrl,
                slug: data.slug,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                published: data.published,
            }
        });

    } catch (error) {
        console.error("Error al actualizar el post:", error);
        return {
            success: false,
            message: "Error inesperado en el servidor. Por favor, inténtalo de nuevo."
        }
    }
    
    // Invalidar caché
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/admin/blog");

    redirect(`/blog/${data.slug}`);
}
