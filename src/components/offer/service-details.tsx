"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ArrowDownNarrowWideIcon, ArrowUpRightFromCircle } from "lucide-react";
import MainPopover from "./popover/main-popover";
import Link from "next/link";
import { PopoverDemo } from "./popover/popover-component";

const detailsVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function ServiceDetails({ service }: { service: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  return (
    <motion.div
      className="w-full md:w-2/3 bg-primary/5 p-6 rounded-lg"
      variants={detailsVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex items-center mb-4">
        <h3 className="ml-3 text-2xl font-bold text-primary">
          {service.title}
        </h3>
      </div>
      <p className="text-foreground/80">{service.description}</p>
      {/* Add more detailed information here */}
      <motion.div
        className="mt-4 p-4 bg-background rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {service.title === "Vidrios para Vehículo" ? (
          <div className="flex flex-col justify-center">
            <div className="flex gap-x-2 items-center justify-between">
              {!isOpen ? (
                <p className="text-sm"> Ver más información y catalogo</p>
              ) : (
                <p> Ver menos </p>
              )}
              {isOpen ? (
                <Button onClick={() => setIsOpen(false)}>
                  <ArrowUpRightFromCircle />
                </Button>
              ) : (
                <Button onClick={() => setIsOpen(true)}>
                  <ArrowDownNarrowWideIcon />
                  Toca Aquí
                </Button>
              )}
            </div>
            {isOpen && (
              <div className="mt-10 flex flex-col gap-y-6">
                <p>
                  Manejamos todos los vidrios para su vehículo.{" "}
                  <span className="font-bold">
                    Lista detallada de nuestras referencias (Seleccione el de su
                    interes):{" "}
                  </span>
                </p>
                <div className="flex flex-col gap-y-2">
                  <MainPopover />
                </div>
              </div>
            )}
          </div>
        ) : service.title === "Instalación pelicula Antirobo de 50 micras" ? (
          <>
            <div className="flex gap-x-2 items-center justify-between">
              {!isOpen2 ? (
                <p className="text-sm"> Ver más información y catalogo</p>
              ) : (
                <p> Ver menos </p>
              )}
              {isOpen2 ? (
                <Button onClick={() => setIsOpen2(false)}>
                  <ArrowUpRightFromCircle />
                </Button>
              ) : (
                <Button onClick={() => setIsOpen2(true)}>
                  <ArrowDownNarrowWideIcon />
                  Toca Aquí
                </Button>
              )}
            </div>
            {isOpen2 && (
              <PopoverDemo
                Trigger={"¿Como funciona?"}
                Content={
                  <div className="flex flex-col items-center justify-center gap-y-4">
                    <p className="text-sm text-muted-foreground">
                      Nuestra película antirrobo de 50 micras es una capa
                      ultrarresistente diseñada para proteger vidrios contra
                      impactos y roturas. Gracias a su avanzada tecnología,
                      actúa como un escudo invisible, manteniendo el vidrio
                      intacto frente a intentos de robo o vandalismo.
                    </p>
                    <Image
                      src={`/global/${"ANTIROBO-DIALOG.png"}`}
                      alt={"antirobo"}
                      width={150}
                      height={150}
                    />
                    <Link href={"/contact"}>
                      <Button size={"sm"}>Cotizar para mi vehículo</Button>
                    </Link>
                  </div>
                }
              />
            )}
          </>
        ) : (
          ""
        )}
      </motion.div>
      {isOpen || isOpen2 ? (
        ""
      ) : (
        <div className="flex flex-col justify-center items-center gap-y-4">
          <Image
            src={`/global/${
              service.title === "Vidrios para Vehículo"
                ? "carro-vidrios.png"
                : service.title === "Instalación de vidrios blindados" ||
                  service.title === "Mantenimiento de vehículos blindados"
                ? "suv-armored.png"
                : service.title === "Instalación de Sunroof" ||
                  service.title === "Mantenimiento de Sunroof"
                ? "sunroof.png"
                : "carro-vidrios.png"
            }`}
            alt="imagen de vidrios para vehículo"
            width={420}
            height={250}
            className="md:h-[420px] h-[250px] w-full overflow-hidden"
          />
          <Link href={"/contact"} className="w-[50%]">
            <Button size={"sm"}>Cotizar para mi vehículo</Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
