"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const logos = [
  "/logos/audi.png",
  "/logos/bmw.png",
  "/logos/ford.png",
  "/logos/lexus.png",
  "/logos/mazda.png",
  "/logos/mercedes-benz.png",
  "/logos/toyota.png",
  "/logos/volvo.png",
  "/logos/subaru.png",
  "/logos/volswagen.png",
  "/logos/honda.png",
  "/logos/hyundai.png",
  "/logos/kia.png",
  "/logos/jeep.png",
];

export default function AutoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleLogos, setVisibleLogos] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibleLogos = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width < 640) setVisibleLogos(2);
        else if (width < 1024) setVisibleLogos(3);
        else setVisibleLogos(4);
      }
    };

    updateVisibleLogos();
    window.addEventListener("resize", updateVisibleLogos);

    return () => window.removeEventListener("resize", updateVisibleLogos);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden bg-black">
      <div className="flex flex-col items-center justify-center mt-10">
        <div>
          <h1 className="text-2xl text-white text-center font-bold mt-2">
            Trabajamos con las mejores márcas del{" "}
            <span className="bg-muted-foreground rounded-md">mercado</span>
          </h1>
        </div>
        <motion.div
          className="flex"
          animate={{
            x: `-${(currentIndex * 100) / visibleLogos}%`,
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          {logos.concat(logos.slice(0, visibleLogos)).map((logo, index) => (
            <motion.div
              key={index}
              className={`flex-shrink-0 p-2`}
              style={{ width: `${100 / visibleLogos}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Image
                src={logo}
                alt={`Logo ${index + 1}`}
                width={100}
                height={100}
              />
            </motion.div>
          ))}
        </motion.div>
        <div>
          <p className="p-2 text-center">
            Te respaldamos con referencias{" "}
            <span className="underline font-bold">importadas</span> o{" "}
            <span className="underline font-bold">nacionales</span>. Brindandote
            la mejor calidad y comodidad en cada uno de nuestros vidrios y
            servicios
          </p>
        </div>
      </div>
    </div>
  );
}
