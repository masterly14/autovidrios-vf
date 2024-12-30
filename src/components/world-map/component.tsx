"use client";
import { motion } from "motion/react";
import { WorldMap } from ".";

export function WorldMapDemo() {
  return (
    <div className="py-8 md:mt-0 pt-20 dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl text-black">
          Importadores
          <span className="text-neutral-400 font-bold">
            {" "}directos de vidrios para vehículo
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Nos caracterizamos por nuestros vidrios para vehículo americanos. Importados desde Miami y nuestros tiempos de entrega son ultra rápidos
        </p>
      </div>
      <WorldMap
        dots={[
          {
            start: { lat: 25.7617, lng: -80.1918 },
            end: { lat: -10.5709, lng: -70.2973 },
          },
        ]}
      />
    </div>
  );
}
