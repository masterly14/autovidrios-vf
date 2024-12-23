"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, PenTool, Printer, ShoppingBag, Package, Thermometer } from 'lucide-react';
import ServiceList from "./service-list";
import ServiceDetails from "./service-details";



const services = [
  {
    title: "Vidrios para Vehículo",
    description: "En Autovidrios V&F en conjunto con World Class Glass, manejamos vidrios de primera calidad nacionales o importados. Nos destacamos por tener una importación ultra rápida y eficiente.",
  },
  {
    title: "Instalación de vidrios blindados",
    description: "Somos expertos en la instalación de vidrios blindados para vehículos de todo tipo. ¡Su seguridad es nuestra prioridad!.",
  },
  {
    title: "Mantenimiento de vehículos blindados",
    description: "No basta solo con instalar vidrios blindados, también es necesario mantenerlos en óptimas condiciones para garantizar tu seguridad. Por eso en Autovidrios V&F en conjunto con World Class Glass, ofrecemos el servicio de mantenimiento de vehículos blindados para asegurar siempre su protección.",
  },
  {
    title: "Instalación de Sunroof",
    description: "Disponemos de apliques decorativos y funcionales para personalizar prendas y accesorios.",
  },
  {
    title: "Mantenimiento de Sunroof",
    description: "Suministramos maquinaria y repuestos esenciales para optimizar procesos de confección.",
  },
  {
    title: "Instalación pelicula Antirobo de 50 micras",
    description: "Garantizamos acabados perfectos y duraderos mediante nuestro servicio de termofijado profesional.",
  },
];


export default function OurServices() {
  const [selectedService, setSelectedService] = useState<number | null>(0);

  return (
    <section className="py-16 px-4 bg-background text-foreground">
      <div className="container mx-auto">
        <motion.h2
          className={`mb-12 text-center text-3xl font-bold text-primary md:text-4xl text-[#FF8B8B]`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nuestros Servicios
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-8">
          <ServiceList
            services={services}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
          <AnimatePresence mode="wait">
            {selectedService !== null && (
              <ServiceDetails
                key={selectedService}
                service={services[selectedService]}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}