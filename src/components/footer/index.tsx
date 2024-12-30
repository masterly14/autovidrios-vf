import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-600 py-8 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">
              Contactanos a nuestras lineas oficiales:{" "}
            </h3>
            <p className="mb-1">+57 3112988995</p>
            <p className="mb-1">+57 3193511128</p>
            <p>(601) 938 9315</p>
            <p>(601) 805 0502</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0 text-center">
            <div className="flex items-center justify-center gap-x-3">
              <Image
                src={"/logos/Autovidrios-V&F.webp"}
                alt="logo-autovidrios-v&f"
                loading="lazy"
                width={150}
                height={100}
                className="object-cover"
              />
              <Image
                src={"/logos/wcg.webp"}
                loading="lazy"
                alt="logo-wcg"
                width={100}
                height={100}
                className="rounded-2xl"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end space-x-4">
            <Link
              href="https://www.facebook.com/profile.php?id=61571166966495"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            >
              <Facebook size={24} />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://www.instagram.com/world_class_glass/"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            >
              <Instagram size={24} />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Autovidrios V&F - World Class Glass. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
