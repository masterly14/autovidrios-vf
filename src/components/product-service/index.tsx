"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import AutoCarousel from "../carousel/component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductPageComponent = () => {
  return (
    <div className="w-full min-h-screen flex flex-col mx-auto items-center justify-start md:p-0 p-5 text-white">
      <div className="flex flex-col md:flex-row gap-x-10 w-full max-w-6xl mt-10">
        <div className="flex flex-col gap-y-7 md:w-1/2 w-full mb-10 mt-10">
          <h1>
            Instalación Profesional de Sunroof y Techos Panorámicos para
            Vehículos
          </h1>
          <p className="text-gray-300">
            En Autovidrios V&F, en alianza con World Class Glass, somos los
            expertos en instalación de sunroof en Bogotá con más de 10 años de
            experiencia. Realizamos instalaciones profesionales de techos
            corredizos, panorámicos y abatibles para todas las marcas de
            vehículos. Nuestro equipo certificado garantiza un trabajo de
            calidad con productos importados y nacionales que cumplen los más
            altos estándares de seguridad.
          </p>
          <Link href="/contacto">
            <Button size="lg">Cotizar ahora</Button>
          </Link>
        </div>
        <div className="md:w-1/2 w-full">
          <Image
            src="/hero/sunroof.webp"
            alt="imagen-sunroof"
            width={600}
            height={600}
            className="rounded-xl w-full h-auto"
          />
        </div>
      </div>

      <Tabs defaultValue="tipos" className="w-full max-w-6xl mt-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tipos">Tipos de Sunroof</TabsTrigger>
          <TabsTrigger value="beneficios">Beneficios</TabsTrigger>
          <TabsTrigger value="proceso">Proceso de Instalación</TabsTrigger>
        </TabsList>
        <TabsContent value="tipos">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {["Panorámico", "Corredizo"].map((tipo) => (
              <Card key={tipo}>
                <CardHeader>
                  <CardTitle>{tipo}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tipo === "Panorámico" ? (
                    <p>
                      El techo panorámico ofrece la máxima visibilidad y entrada
                      de luz natural. Ideal para SUVs y vehículos familiares,
                      cubre gran parte del techo del auto proporcionando una
                      experiencia única de conducción. Instalamos las mejores
                      marcas con garantía de fábrica.
                    </p>
                  ) : tipo === "Corredizo" ? (
                    <p>
                      El sunroof corredizo es la opción más popular por su
                      versatilidad. Se desliza eléctrica o manualmente sobre el
                      techo del vehículo, permitiendo una apertura parcial o
                      total. Perfecto para cualquier tipo de auto, desde
                      compactos hasta camionetas.
                    </p>
                  ) : (
                    <p></p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="beneficios">
          <ul className="list-disc pl-5 mt-6 space-y-2">
            <li>Iluminación natural superior con nuestros techos panorámicos certificados</li>
            <li>Ventilación eficiente y controlada para mayor confort en su vehículo</li>
            <li>Incremento signficativo en el valor comercial de su auto</li>
            <li>Diseño moderno que mejora la estetica y exclusividad de su vehículo</li>
            <li>Instalación profesional con garantía</li>
          </ul>
        </TabsContent>
        <TabsContent value="proceso">
          <ol className="list-decimal pl-5 mt-6 space-y-2">
            <li>Evaluación técnica profesional de su vehículo para sunroof</li>
            <li>Asesoría especializada en la selección del tipo de techo solar ideal</li>
            <li>Preparación y adecuación estructural del techo del vehículo</li>
            <li>Instalación profesional con técnicos certificados</li>
            <li>Pruebas exhaustivas de funcionamiento y hermeticidad</li>
            <li>Entrega con garantía</li>
          </ol>
        </TabsContent>
      </Tabs>

      <section className="w-full mt-16 ">
        <AutoCarousel />
      </section>
      <section className="w-full max-w-6xl mt-16">
        <h2 className="text-3xl font-bold mb-6">Preguntas Frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              q: "¿Cuánto tiempo toma la instalación?",
              a: "La instalación profesional de un sunroof en nuestro taller, toma entre 4 y 8 horas, dependiendo del modelo de su vehículo y el tipo de techo solar seleccionado. Realizamos el trabajo en el mismo día con cita previa.",
            },
            {
              q: "¿La instalación afecta la garantía del vehículo?",
              a: "La instalación profesional realizada por nuestros técnicos certificados mantiene la integridad estructural del vehículo y no afecta la garantía del fabricante. Ofrecemos garantía propia sobre la instalación y el producto.",
            },
            {
              q: "¿Todos los vehículos son aptos para la instalación de un sunroof?",
              a: "La mayoría de vehículos son compatibles con la instalación de techos solares. Realizamos una evaluación técnica para determinar el mejor tipo de sunroof para su auto, considerando modelo, año y características específicas.",
            },
          ].map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="w-full max-w-6xl mt-16 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>¿Desea transformar su vehículo con un sunroof?</CardTitle>
            <CardDescription>
            Solicite ahora su cotización personalizada y reciba asesoría de nuestros expertos certificados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/contacto">
              <Button size="lg">Solicitar Cotización</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ProductPageComponent;
