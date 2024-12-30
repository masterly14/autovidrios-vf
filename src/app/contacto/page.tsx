import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from './_components/contact-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Venta de vidrios originales e importados para vehículos en Bogotá',
  description: "Dejanos un mensaje y nos pondremos en contacto contigo lo antes posible para ayudarte con tu solicitud. Autovidrios V&F - World Class Glass."
}
const page = () => {
  return (
    <div 
      className="flex items-center justify-center py-10 bg-black"
      style={{ backgroundImage: 'url(/hero/contact-image.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
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