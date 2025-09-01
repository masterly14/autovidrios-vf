"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createBlogPost, updateBlogPost, FormState } from "@/actions/blog";
import { toast } from "@/hooks/use-toast";
import { BlogPost } from "@prisma/client";

// Función para generar un slug a partir de un texto
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Reemplazar espacios con -
    .replace(/[^\w-]+/g, "") // Eliminar caracteres no alfanuméricos excepto -
    .replace(/--+/g, "-"); 
};

// Función para generar una meta descripción a partir del contenido
const generateMetaDescription = (content: string): string => {
  const textContent = content.replace(/<[^>]*>/g, "").replace(/\s+/g, ' ').trim();
  return textContent.slice(0, 160);
};


const initialState: FormState = {
  success: false,
  message: "",
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (isEditing ? "Actualizando..." : "Guardando...") : (isEditing ? "Actualizar Artículo" : "Guardar Artículo")}
    </Button>
  );
}

interface BlogEditorProps {
    post?: BlogPost
}

export default function BlogEditor({ post }: BlogEditorProps) {
  const isEditing = !!post;

  const action = isEditing ? updateBlogPost.bind(null, post.id) : createBlogPost;
  const [state, formAction] = useFormState(action, initialState);
  
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [published, setPublished] = useState(post?.published || false);

  // Generar slug automáticamente cuando el título cambia
  useEffect(() => {
    if (!isEditing) {
        const generatedSlug = slugify(title);
        setSlug(generatedSlug);
        setMetaTitle(`${title} | Autovidrios V&F`);
    }
  }, [title, isEditing]);

  // Generar meta descripción automáticamente cuando el contenido cambia
  useEffect(() => {
    if (!isEditing && content) {
      const generatedDesc = generateMetaDescription(content);
      setMetaDescription(generatedDesc);
    }
  }, [content, isEditing]);

  // Mostrar notificaciones de éxito o error
  useEffect(() => {
    if (state.message) {
        if(state.success || state.message.includes("actualizado")) {
            toast({ title: "Éxito", description: state.message });
        } else {
            toast({ title: "Error", description: state.message, variant: "destructive" });
        }
    }
  }, [state]);


  return (
    <form action={formAction} className="container mx-auto max-w-4xl py-10 space-y-8">
      <h1 className="text-3xl font-bold">{isEditing ? "Editar Artículo" : "Crear Nuevo Artículo"}</h1>

      <div className="space-y-2">
        <Label htmlFor="title">Título del Artículo</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Cómo mantener tus vidrios impecables"
          required
          className="text-lg"
        />
        {state.errors?.title && <p className="text-red-500 text-sm">{state.errors.title[0]}</p>}
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="imageUrl">URL de la Imagen Principal</Label>
          <Input 
            id="imageUrl"
            name="imageUrl"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            required
          />
          {state.errors?.imageUrl && <p className="text-red-500 text-sm">{state.errors.imageUrl[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenido del Artículo</Label>
        <Textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe aquí el contenido del artículo. Puedes usar HTML."
          rows={20}
          required
        />
        <p className="text-sm text-muted-foreground">
          Puedes usar etiquetas HTML para formatear el texto (ej: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;).
        </p>
        {state.errors?.content && <p className="text-red-500 text-sm">{state.errors.content[0]}</p>}
      </div>
      
      <div className="p-6 border rounded-lg bg-gray-50 space-y-6">
        <h2 className="text-xl font-semibold">Optimización SEO (Automático)</h2>
        <p className="text-sm text-muted-foreground">
          Estos campos se generan automáticamente, pero puedes ajustarlos para mejorar el SEO.
        </p>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Amigable (Slug)</Label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          {state.errors?.slug && <p className="text-red-500 text-sm">{state.errors.slug[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Título</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            required
          />
           {state.errors?.metaTitle && <p className="text-red-500 text-sm">{state.errors.metaTitle[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Descripción</Label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            maxLength={160}
            required
          />
           <p className="text-sm text-right text-muted-foreground">{metaDescription.length} / 160</p>
           {state.errors?.metaDescription && <p className="text-red-500 text-sm">{state.errors.metaDescription[0]}</p>}
        </div>
      </div>

       <div className="flex items-center space-x-4">
          <Label htmlFor="published">Publicar</Label>
          <Switch 
            id="published" 
            name="published"
            checked={published}
            onCheckedChange={setPublished}
           />
          <span className="text-muted-foreground">
            Activa esta opción para que el artículo sea visible en el blog.
          </span>
       </div>
      
      <div className="flex justify-end">
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
