import ProductPageComponent from "@/components/product-service";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Instalación de Sunroof en Bogotá | Expertos en Techos Panorámicos | Autovidrios V&F",
  description:
    "Instalación de sunroof corredizos, panorámicos y abatibles para vehículos en Bogotá. Expertos en instalación de sunroof con más de 10 años de experiencia.",
  keywords: [
    "sunroof Bogotá",
    "instalación techo solar",
    "techo corredizo automóvil",
    "servicio sunroof vehículos",
    "precio sunroof carros",
  ],
};
const page = () => {
  return <ProductPageComponent />;
};

export default page;
