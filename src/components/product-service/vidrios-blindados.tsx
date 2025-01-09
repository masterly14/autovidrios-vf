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

const ProductPageVidriosBlindados = () => {
  return (
    <div className="w-full min-h-screen flex flex-col mx-auto items-center justify-start md:p-0 p-5 text-white">
      <div className="flex flex-col md:flex-row gap-x-10 w-full max-w-6xl mt-10">
        <div className="flex flex-col gap-y-7 md:w-1/2 w-full mb-10 mt-10">
          <h1>
            Instalación y venta de vidrios blindados de Sunroof para
            Vehículos
          </h1>
          <p className="text-gray-300">
            En Autovidrios V&F, en alianza con World Class Glass, somos los
            expertos en instalación y comercialización de vidrios blindados para vehículos, con más de 10 años de
            experiencia. 
          </p>
          <Link href="/contacto">
            <Button size="lg">Cotizar ahora</Button>
          </Link>
        </div>
        <div className="md:w-1/2 w-full">
          <Image
            src="/hero/suv-blindada.webp"
            alt="imagen-sunroof"
            width={600}
            height={600}
            className="rounded-xl w-full h-auto"
          />
        </div>
      </div>

      <Tabs defaultValue="tipos" className="w-full max-w-6xl mt-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tipos">Servicios</TabsTrigger>
          <TabsTrigger value="beneficios">Beneficios</TabsTrigger>
          <TabsTrigger value="proceso">Proceso de Instalación</TabsTrigger>
        </TabsList>
        <TabsContent value="tipos">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {["Instalación", "Mantenimiento"].map((tipo) => (
              <Card key={tipo}>
                <CardHeader>
                  <CardTitle>{tipo}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tipo === "Instalación" ? (
                    <p>
                      En Autovidrios V&F en conjunto con World Class Glass, somos expertos en la instalación de vidrios blindados para vehículo. La calidad en la instalación es nuestra prioridad. Nuestro equipo experto se encarga de cada detalle, desde el ajuste preciso hasta la fijación segura, asegurando que tu vidrio esté instalado con la máxima precisión y profesionalismo para garantizar tu seguridad.
                    </p>
                  ) : tipo === "Mantenimiento" ? (
                    <p>
                      En world Class Glass tambien damos mantenimiento a vehiculos blindados, ofrecemos servicios de reparación y reemplazo de vidrios blindados para vehículos. Nuestro equipo de expertos está capacitado para brindar un servicio de calidad y garantizar la seguridad de tu vehículo. Contamos con una amplia gama de vidrios blindados para vehículos de todas las marcas y modelos, para que puedas encontrar el vidrio que mejor se adapte a tus necesidades.
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
            <li>Seguridad de primera calidad</li>
            <li>Intalación garantizada</li>
            <li>Pruebas exhaustivas para garantizar el funcionamiento.</li>
          </ul>
        </TabsContent>
        <TabsContent value="proceso">
          <ol className="list-decimal pl-5 mt-6 space-y-2">
            <li>Evaluación técnica profesional de su vehículo</li>
            <li>Asesoría especializada en la selección</li>
            <li>Preparación y adecuación estructural del vehículo</li>
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
              a: "La instalación depende del modelo de su vehículo y el tipo de servicio seleccionado. Realizamos el trabajo en el mismo día con cita previa.",
            },
            {
              q: "¿La instalación afecta la garantía del vehículo?",
              a: "La instalación profesional realizada por nuestros técnicos certificados mantiene la integridad estructural del vehículo y no afecta la garantía del fabricante. Ofrecemos garantía propia sobre la instalación y el producto.",
            },
            {
              q: "¿Todos los vehículos son aptos para la instalación?",
              a: "La mayoría de vehículos son compatibles con la instalación. Realizamos una evaluación técnica para determinar el mejor tipo de vidrio o servicio para su auto, considerando modelo, año y características específicas.",
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
            <CardTitle>¿Desea transformar su vehículo?</CardTitle>
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

export default ProductPageVidriosBlindados;
