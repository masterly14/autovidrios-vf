"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import GlassCanvas from "./glass-canvas";
import ProductsShowcase from "./products-showcase";

type Phase = "reveal" | "ally" | "ready";

export default function GlassViewer() {
  const [phase, setPhase] = useState<Phase>("reveal");

  const handleRevealComplete = () => {
    setPhase("ally");
    window.setTimeout(() => setPhase("ready"), 1600);
  };

  return (
    <div className="bg-black text-[#E9EEF3]">
      <section className="relative w-full min-h-[calc(100vh-100px)] md:min-h-[calc(100vh-120px)] overflow-hidden bg-black">
        <GlassCanvas onRevealComplete={handleRevealComplete} />

        {/* Vignette cinematográfica */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Marca mínima durante el reveal */}
        <AnimatePresence>
          {phase === "reveal" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="pointer-events-none absolute top-8 left-1/2 z-[2] -translate-x-1/2 text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-white/70"
            >
              Alianzas con aseguradoras
            </motion.p>
          )}
        </AnimatePresence>

        {/* Texto aliado + hint de interacción */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex flex-col items-center px-6 pb-10 md:pb-14">
          <AnimatePresence>
            {(phase === "ally" || phase === "ready") && (
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-center"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mb-6 h-px w-16 origin-center bg-[#7FD8F2]/70"
                />
                <h1 className="text-[clamp(28px,5.5vw,48px)] font-medium tracking-[-0.02em] text-white">
                  Somos tu mejor aliado
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.8 }}
                  className="mt-4 text-sm md:text-base text-[#8A95A3] max-w-lg mx-auto leading-relaxed"
                >
                  Precios competitivos, respuesta profesional y atención rápida
                  para las reclamaciones de tus asegurados.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "ready" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="mt-8 text-[10px] uppercase tracking-[0.22em] text-[#566070]"
              >
                Arrastra para rotar · Desplaza para explorar
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ProductsShowcase />
    </div>
  );
}
