"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    number: "01",
    title: "Vidrios para vehículo",
    subtitle: "Reposición · OEM e importados",
    description:
      "Parabrisas, laterales y paneles traseros listos para atender siniestros. Stock ágil, precios de alianza e instalación certificada.",
    href: "/servicios-productos/vidrios-para-vehiculo",
    image: "/global/wcg/img-3.webp",
  },
  {
    number: "02",
    title: "Vidrios blindados",
    subtitle: "Seguridad · Casos especiales",
    description:
      "Soluciones blindadas con trazabilidad técnica. Ideal para pólizas de alto valor y vehículos que exigen protección superior.",
    href: "/servicios-productos/instalacion-vidrios-blindados",
    image: "/global/wcg/img-21.webp",
  },
  {
    number: "03",
    title: "Sunroof",
    subtitle: "Instalación y mantenimiento",
    description:
      "Reparación, sellado y mantenimiento de sunroof con tiempos de respuesta claros para no demorar la operación de tus clientes.",
    href: "/servicios-productos/instalacion-sunroof",
    image: "/global/wcg/img-5.webp",
  },
  {
    number: "04",
    title: "Película antirrobo",
    subtitle: "Prevención · 50 micras",
    description:
      "Refuerzo transparente que reduce riesgo de robo. Opción de valor agregado para pólizas y programas de prevención.",
    href: "/servicios-productos/instalacion-pelicula-antirobo",
    image: "/global/ANTIROBO-DIALOG.webp",
  },
  {
    number: "05",
    title: "Polarizados",
    subtitle: "Confort · UV · Privacidad",
    description:
      "Instalación profesional de polarizados de calidad. Servicio complementario con acabado impecable y entrega oportuna.",
    href: "/servicios-productos/polarizados",
    image: "/global/wcg/img-8.webp",
  },
  {
    number: "06",
    title: "Plumillas",
    subtitle: "Visibilidad y seguridad vial",
    description:
      "Plumillas de calidad para restaurar visibilidad en taller. Complemento rápido dentro del proceso de atención al siniestro.",
    href: "/servicios-productos/plumillas-para-carro",
    image: "/global/wcg/img-14.webp",
  },
];

const pillars = [
  {
    title: "Precios de alianza",
    text: "Condiciones comerciales pensadas para volumen y continuidad con aseguradoras.",
  },
  {
    title: "Respuesta rápida",
    text: "Equipo operativo listo para agendar, diagnosticar e instalar sin fricción.",
  },
  {
    title: "Trato profesional",
    text: "Comunicación clara, seguimiento del caso y reportes que facilitan tu gestión.",
  },
];

export default function ProductsShowcase() {
  return (
    <section className="relative bg-black text-[#E9EEF3] border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 md:px-12 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 md:mb-20 max-w-2xl"
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#7FD8F2]">
            Alianzas estratégicas
          </p>
          <h2 className="text-[clamp(32px,5vw,52px)] font-medium leading-[1.05] tracking-[-0.02em] text-white">
            El aliado que tus
            <br />
            asegurados merecen.
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-[#8A95A3] max-w-xl">
            Buscamos alianzas con aseguradoras. Ofrecemos buenos precios, un
            equipo profesional y atención rápida para que cada reclamación se
            resuelva con calidad World Class Glass.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-20 md:mb-28 border-y border-white/10 py-12"
        >
          {pillars.map((pillar) => (
            <div key={pillar.title}>
              <h3 className="text-lg font-medium text-white mb-3">
                {pillar.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[#8A95A3]">
                {pillar.text}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#7FD8F2]">
            Portafolio de servicio
          </p>
        </motion.div>

        <div className="flex flex-col">
          {products.map((product, index) => (
            <motion.div
              key={product.href}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: Math.min(index * 0.06, 0.24),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={product.href}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 md:py-14 border-t border-white/10 transition-colors hover:border-[#7FD8F2]/40"
              >
                <div className="md:col-span-1 flex items-start">
                  <span className="text-xs tracking-[0.2em] text-[#566070] group-hover:text-[#7FD8F2] transition-colors">
                    {product.number}
                  </span>
                </div>

                <div className="md:col-span-5 flex flex-col justify-center">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#7FD8F2]/80 mb-3">
                    {product.subtitle}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-[-0.02em] text-white group-hover:text-[#7FD8F2] transition-colors">
                    {product.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#8A95A3] max-w-md">
                    {product.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm tracking-[0.04em] text-[#E9EEF3] opacity-70 group-hover:opacity-100 transition-opacity">
                    Ver servicio
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>

                <div className="md:col-span-6 relative aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-[#0a0c10]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-80 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </Link>
            </motion.div>
          ))}
          <div className="border-t border-white/10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-20 md:mt-28 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#566070] mb-3">
              Construyamos una alianza
            </p>
            <p className="text-xl md:text-2xl text-white max-w-lg leading-snug">
              Hablemos de tarifas, tiempos de atención y cobertura para tus
              asegurados.
            </p>
          </div>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center border border-[#7FD8F2]/45 px-8 py-4 text-sm tracking-[0.06em] text-white transition-colors hover:border-[#7FD8F2] hover:bg-[#7FD8F2]/10"
          >
            Solicitar alianza →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
