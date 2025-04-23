import Link from "next/link"
import { Star, Home, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-muted rounded-lg shadow-lg p-6 md:p-8 text-center">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-muted-foreground mb-4">
            Gracias por preferir a World Class Glass
          </h1>
          <p className="text-gray-600 mb-6">
            Nos preocupamos por brindar la mejor calidad en cada uno de nuestros servicios, instalaciones y
            mantenimientos. Pulsa el siguiente botón para darnos una calificación en Google
          </p>

          <a
            href="https://g.page/r/CY2ApsthuCH6EAE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-200 text-lg">
              Calificar en Google
            </Button>
          </a>

          <div className="flex justify-center mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400 mx-1" />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 mx-auto mb-6">
              <Home className="w-4 h-4" />
              Volver a la página principal
            </Button>
          </Link>

          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-3">Síguenos en redes sociales</h2>
            <div className="flex justify-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61571166966495"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 text-blue-600" />
              </a>
              <a
                href="https://www.instagram.com/world_class_glass/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 text-pink-600" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} World Class Glass. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
