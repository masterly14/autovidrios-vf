import PartnershipAnnouncement from "@/components/partnership/announcement";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Venta de Vidrios para Carro en Bogotá | Originales e Importados",
  description:
    "Vidrios para carro en Bogotá, expertos en la instalación de vidrios para carro, manejamos los mejores vidrios del mercado. Con más de 20 años de experiencia, Manejamos vidrios originales e importados",
};

const page = () => {
  return <PartnershipAnnouncement />;
};

export default page;
