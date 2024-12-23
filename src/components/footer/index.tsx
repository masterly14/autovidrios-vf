import Link from 'next/link'
import { Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Contacto</h3>
            <p className="mb-1">Teléfono: +1 234 567 890</p>
            <p>WhatsApp: +1 098 765 432</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0 text-center">
            <Link 
              href="/contacto" 
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              Contacto
            </Link>
          </div>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end space-x-4">
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
              <Facebook size={24} />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
              <Instagram size={24} />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

