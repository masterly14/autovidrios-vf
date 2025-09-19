import ProductPagePlumillas from '@/components/plumillas';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title:
    "Plumillas para carro en Bogotá - Venta de plumillas para vehículo - Instalación de plumillas Bogotá",
  description:
    "Venta e instalación de plumillas para carro en Bogotá. Expertos en plumillas de marcas reconocidas como Youwin, KTC y más. Más de 20 años de experiencia.",
  keywords: [
    "Plumillas para carro Bogotá",
    "venta de plumillas para vehículo",
    "instalación de plumillas Bogotá",
    "plumillas Youwin Bogotá",
    "plumillas KTC Bogotá",
    "plumillas para auto Bogotá",
    "cambio de plumillas vehículo",
    "plumillas de calidad Bogotá",
  ],
};
const page = () => {
  return (
    <ProductPagePlumillas />
  )
}

export default page
