import PartnershipAnnouncement from "@/components/partnership/announcement";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Vidrios para carro en Bogotá - Vidrios para vehículo en Bogotá - Venta de vidrios para carro en Bogotá",
  description:
    "Vidrios para carro en Bogotá, expertos en la instalación de vidrios para carro, manejamos los mejores vidrios del mercado. Con más de 20 años de experiencia, Manejamos vidrios originales e importados",
};

const page = () => {
  return <PartnershipAnnouncement />;
};

export default page;
