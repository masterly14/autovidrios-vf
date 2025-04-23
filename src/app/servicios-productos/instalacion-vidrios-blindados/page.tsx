import ProductPageVidriosBlindados from '@/components/product-service/vidrios-blindados'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title:
    "Vidrios blindados para carro en Bogotá - Blindar carro Bogotá - Vidrios para vehículo Bogotá",
  description:
    "Instalación y venta de vidrios blindados para carro en Bogotá. Expertos en instalación de vidrios blindados con más de 20 años de experiencia.",
  keywords: [
    "Vidrios blindados para auto Bogotá",
    "instalación de vidrios blindados para vehículo",
    "vidrios blindados para vehículos",
    "Venta de vidrios blindados para vehículo en Bogotá",
    "Precio de vidrios blindados para vehículo en Bogotá",	
  ],
};
const page = () => {
  return (
    <ProductPageVidriosBlindados />
  )
}

export default page