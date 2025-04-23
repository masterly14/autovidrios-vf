import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from './_components/contact-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vidrios para vehículo en Bogotá | Vidrios para carro Bogotá | Parabrisas para carro',
  description: "Vidrios para carro Bogotá | Cotizar vidrios para vehículo Bogotá | Parabrisas para vehículo en Bogotá"
}
const page = () => {
  return (
    <div 
      className="flex items-center justify-center py-10 bg-black"
      style={{ backgroundImage: 'url(/hero/contact-image.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Card>
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