import ProductPagePolarizados from "@/components/polarizados";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Polarizados para Carros y Vehículos en Bogotá | Instalación Profesional",
  description:
    "Nuestro equipo experto ofrece soluciones de polarizado personalizadas para su vehículo, garantizando un ajuste perfecto y un acabado perfecto.",
  keywords: [
    "polarizados bogota",
    "polarizados para vehiculo en bogota",
    "Polarizados en Nanoceramica",
    "Servicio de polarizado de vidrios",
    "Polarizado de vidrios para vehículos",
    "polarizados carros Bogotá",
    "vidrios polarizados automóviles",
    "precio polarizado vehículo",
    "instalación polarizados",
  ],
};
const page = () => {
  return <ProductPagePolarizados />;
};

export default page;
