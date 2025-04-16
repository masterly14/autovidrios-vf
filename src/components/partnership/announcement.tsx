"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PartnershipAnnouncement() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute inset-0">
          <Image
            src="/banner.png"
            alt="Vehicle glass background"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 py-20 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-[#00b050]">AUTOVIDRIOS V&F</span> ahora es
              proveedor oficial de <span className="text-[#00b050]">Vitro</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Nos complace anunciar nuestra nueva alianza estratégica con uno de
              los fabricantes de vidrio para vehículos más importantes del
              mundo.
            </p>
            <button className="bg-[#00b050] hover:bg-[#009040] text-white px-6 py-3 rounded-md font-medium flex items-center transition">
              Conocer más sobre esta alianza
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* About Vitro Section */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                Sobre <span className="text-[#00b050]">Vitro</span>
              </h2>
              <p className="text-gray-300 mb-4">
                Vitro es una de las vidrieras más importantes del mundo. Sus
                productos de vidrio tienen el honor de ser parte de la vida
                cotidiana de millones de personas.
              </p>
              <p className="text-gray-300 mb-6">
                A lo largo de su historia, han demostrado un sólido compromiso
                como líder de la industria vidriera, gracias a sus constantes
                investigaciones e iniciativas de inversión tecnológica.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-1 bg-[#00b050]"></div>
                <p className="ml-4 text-sm text-gray-400">
                  Líder en la industria vidriera
                </p>
              </div>
            </div>
            <div className="md:w-1/2 relative h-80 w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00b050]/20 to-transparent rounded-lg"></div>
              <Image
                src="/vitro.webp"
                alt="Vitro manufacturing facility"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Beneficios de nuestra{" "}
            <span className="text-[#00b050]">alianza</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Repite esto por cada beneficio */}
            {/* ... contenido de los beneficios ... */}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Productos <span className="text-[#00b050]">Vitro</span> disponibles
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Ahora ofrecemos una amplia gama de productos Vitro para todo tipo de
            vehículos, desde automóviles particulares hasta vehículos
            comerciales.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-lg">
              <Image
                src={`/vidrios.jpeg`}
                alt={`Producto Vitro`}
                width={400}
                height={300}
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-lg font-bold">Vidrios para Vehículo</h3>
                <p className="text-sm text-gray-300">
                  Vitro maneja los mejores vidrios del mercado colombiano. Somos
                  proveedores oficiales de su marca, así facilitamos que su
                  vehículo tenga lo mejor.
                </p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg">
              <Image
                src={`/blindado.jpeg`}
                alt={`Producto Vitro`}
                width={400}
                height={300}
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-lg font-bold">Vidrios blindados</h3>
                <p className="text-sm text-gray-300">
                  Vitro es fabricante de cristal blindado arquitectónico.
                  Garantizando su fabricación e instalación, con la más alta
                  calidad en diferentes tonalidades, protección y control solar,
                  además de acabados especiales.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href={"/servicios-productos/vidrios-para-vehiculo"}>
              <button className="border border-[#00b050] text-[#00b050] hover:bg-[#00b050] hover:text-white px-6 py-3 rounded-md font-medium transition">
                Ver catálogo completo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-zinc-900"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  ¿Necesita vidrios para su vehículo?
                </h2>
                <p className="text-gray-400">
                  Contáctenos hoy mismo y descubra todos los beneficios de
                  nuestra alianza con Vitro.
                </p>
              </div>
              <div className="md:w-1/3 md:text-right">
                <Link href={"/contacto"}>
                  <button className="bg-[#00b050] hover:bg-[#009040] text-white px-6 py-3 rounded-md font-medium transition w-full md:w-auto">
                    Contactar ahora
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
