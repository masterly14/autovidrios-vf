import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContactForm } from './_components/contact-form'

const page = () => {
  return (
    <div className="flex items-center justify-center  py-10 bg-black">
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