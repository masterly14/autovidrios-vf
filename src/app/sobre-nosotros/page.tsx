import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { PhoneIcon as WhatsappIcon } from 'lucide-react'
import Link from "next/link"
import AutoCarousel from "@/components/carousel/component"
import { Metadata } from "next"


export const metadata: Metadata = {
  title: 'Sobre Nosotros - Venta de vidrios originales e importados para vehículos en Bogotá',
  description: "Autovidrios V&F nace con el proposito de brindarle al mercado colombiano la mejor calidad y seguridad con los productos para sus vehiculos, cubriend"
}
export default function page() {
  return (
    <div className="flex flex-col justify-center items-center bg-black p-10">
    <Card className="w-full max-w-7xl mx-auto mt-10 bg-black rounded-md">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Section */}
          <div className="relative w-full h-[400px] md:h-full bg-gray-100">
            <Image
              src="/hero/autovidrios-wcg.webp"
              loading="lazy"
              alt="Equipo Polarizados"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-lg">
                Autovidrios V&F nace con el proposito de brindarle al mercado colombiano{" "}
                <span className="font-semibold">la mejor calidad y seguridad con los productos para sus vehiculos</span>, cubriendo desde vidrios hasta instalaciones y demás servicios.
              </p>

              <p className="text-lg">
                Somos una empresa líder dedicada a la instalación e importación de los mejores vidrios para vehículos, con la mejor calidad y garantía del mercado. Nos hemos unido con World Class Glass, para entregarte una categoria más amplica de servicios y productos y poderte entregar la mejor experiencia. 
              </p>

              <div className="pt-4">
                <h2 className="text-2xl font-bold text-center">SU SEGURIDAD Y CONFORT ES NUESTRO TRABAJO.</h2>
                <div className="mt-2 border-t border-gray-200 w-48 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* WhatsApp Floating Button */}
      <Link
        href="https://wa.me/3112688995"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsappIcon className="w-6 h-6" />
      </Link>
    </Card>
    <AutoCarousel />
    </div>
  )
}

