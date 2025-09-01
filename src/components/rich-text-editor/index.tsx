"use client";

import { Textarea } from "@/components/ui/textarea";

interface PlainTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /**
   * Nombre del campo para que se incluya en FormData al enviar el formulario.
   * Por ejemplo: "content".
   */
  name?: string;
}

/*
 * Editor reducido a un <textarea> controlado.  
 * – Sin lógica de formato ni dependencias externas.  
 * – Mantiene altura mínima y estilos coherentes con Tailwind.  
 */
export default function PlainTextEditor({ value, onChange, placeholder, name }: PlainTextEditorProps) {
  return (
    <Textarea
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Escribe aquí…"}
      className="min-h-[200px]"
      required
    />
  );
}
