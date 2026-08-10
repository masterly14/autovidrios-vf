import GlassViewer from "@/components/glass-viewer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Alianzas con aseguradoras | Autovidrios V&F - World Class Glass",
  description:
    "Aliado estratégico para aseguradoras: precios competitivos, respuesta profesional y atención rápida en reposición de vidrios automotrices, blindados, sunroof y más en Bogotá.",
};

export default function IngenieriaVidrioPage() {
  return <GlassViewer />;
}
