"use client";
import { motion } from "motion/react";
import { WorldMap } from ".";

export function WorldMapDemo() {
  return (
    <div className=" py-40 dark:bg-black bg-black w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl text-white">
          Importadores{" "}
          <span className="text-neutral-400">
            {"directos".split("").map((word, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Nos caracterizamos por nuestros vidrios americanos importados, cuidamos cada detalle para que nuestros clientes, reciban la mejor calidad
        </p>
      </div>
      <WorldMap
        dots={[
          {
            start: { lat: 39.0119, lng: -98.4842 },
            end: { lat: -10.5709, lng: -70.2973 }, 
          },
        ]}
      />
    </div>
  );
}
