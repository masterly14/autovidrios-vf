import ProductPagePeliculaAntirobo from '@/components/pelicula-antirobo';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title:
      "Pelicula antirobo para auto en Bogotá",
    description:
      "Instalación de pelicula antirobo para vehículo en Bogotá. Expertos en instalación de vidrios blindados con más de 10 años de experiencia.",
    keywords: [
      "Vidrios blindados para auto Bogotá",
      "Pelicula antirobo para vehículo",
      "Protección para vidrio de vehículo",
      "Venta de vidrios blindados para vehículo en Bogotá",
      "Peliculas antirobo para vehículos en Bogotá",	
    ],
  };
const page = () => {
  return (
    <ProductPagePeliculaAntirobo />
  )
}

export default page