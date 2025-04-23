"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceList from "./service-list";
import ServiceDetails from "./service-details";



const services = [
  {
    title: "Vidrios para Vehículo",
    description: "Vidrios nacionales para vehículo. Vidrios importados para vehículo. Nos destacamos por tener una importaciones rápidad y eficientes de vidrios para vehículo..",
    link: "/servicios-productos/vidrios-para-vehiculo",
  },
  {
    title: "Vidrios blindados para vehículo",
    description: "Instalación de vidrios blindados para carro. ¡Su seguridad es nuestra prioridad!.",
    link: "/servicios-productos/instalacion-vidrios-blindados",
  },
  {
    title: "Mantenimiento de vidrios blindados para carro.",
    description: "No basta solo con instalar vidrios blindados para su carro, también es necesario mantenerlos en óptimas condiciones para garantizar su seguridad. Servicio de mantenimiento de vehículos blindados para asegurar siempre su protección.",
    link: "/servicios-productos/instalacion-vehiculos-blindados",
  },
  {
    title: "Sunroof para vehículo.",
    description: "Sunroof para carro. Brindamos servicio de instalación y mantenimiento de Sunroof para su vehículo.",
    link: "/servicios-productos/instalacion-sunroof",
  },
  {
    title: "Mantenimiento de sunroof",
    description: "Sunroof para carro. Brindamos servicio de instalación y mantenimiento de Sunroof para su vehículo.",
    link: "/servicios-productos/instalacion-sunroof",
  },
  {
    title: "Película antirrobo para vehículo.",
    description: "Instalamos película de seguridad antirrobo de 50 micras para vehículos, ideal para reforzar los vidrios contra intentos de robo. Nuestro servicio incluye termofijado profesional para garantizar una instalación precisa, duradera y con acabados de alta calidad. Proteja su vehículo con tecnología de seguridad avanzada.",
    link: "/servicios-productos/instalacion-pelicula-antirobo",
  },
  {
    title: "Polarizados para vehículos",
    description: "Servicio profesional de instalación de películas polarizadas para carros. Proteja su vehículo del sol, reduzca el calor interior y mejore la privacidad y estética. Usamos polarizados de alta calidad con protección UV y acabados precisos. ¡Ideal para mayor confort y seguridad en la vía!",
  }
];


export default function OurServices() {
  const [selectedService, setSelectedService] = useState<number | null>(0);

  return (
    <section className="py-16 px-4 bg-background text-foreground" id="productos">
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