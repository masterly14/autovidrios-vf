import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from './_components/contact-form'
import { Metadata } from 'next'
import Image from 'next/image' // Importar el componente Image

export const metadata: Metadata = {
  title: 'Contacto - Vidrios para Vehículo en Bogotá | Autovidrios V&F', // Título mejorado
  description: "Contáctanos para cotizar vidrios para tu carro en Bogotá. Expertos en venta e instalación de parabrisas y vidrios para todas las marcas." // Descripción mejorada
}

const page = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen py-10">
      <Image
        src="/hero/contact-image.webp"
        alt="Técnico instalando un parabrisas en un vehículo"
        layout="fill"
        objectFit="cover"
        quality={80}
        className="-z-10" // Para mantenerla en el fondo
      />
      <div className="absolute inset-0 bg-black opacity-50 -z-10"></div> {/* Opcional: para oscurecer la imagen y que el texto resalte */}
      
      <Card className="z-10 w-full max-w-lg mx-4"> {/* Añadido z-10 para que esté por encima de la imagen */}
        <CardHeader>
          <CardTitle>Contáctenos</CardTitle>
          <CardDescription>
            Complete el formulario a continuación y nos pondremos en contacto con usted lo antes posible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default page