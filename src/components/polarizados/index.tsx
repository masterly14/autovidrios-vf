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

const ProductPagePolarizados = () => {
  return (
    <div className="w-full min-h-screen flex flex-col mx-auto items-center justify-start md:p-0 p-5 text-white">
      <div className="flex flex-col md:flex-row gap-x-10 w-full max-w-6xl mt-10">
        <div className="flex flex-col gap-y-7 md:w-1/2 w-full mb-10 mt-10">
          <h1>
            El mejor servicio de polarización de ventanas y carros en Bogotá
          </h1>
          <p className="text-gray-300">
            En Autovidrios V&F en conjunto con World Class Glass, somos expertos
            en brindarle seguridad y elegancia para vehículo. Mejora el estilo y
            la protección de tu vehículo con nuestros servicios de polarizado en
            Bogotá. Ofrecemos soluciones que no solo realzan la estética, sino
            que también protegen el interior contra los dañinos rayos solares y
            aumentan tu privacidad. Utilizamos materiales premium y tecnología
            avanzada para garantizar un acabado impecable y duradero. Nuestro
            polarizado cumple con las normativas locales, asegurando un
            equilibrio perfecto entre elegancia y legalidad. Convierte tu
            vehículo en un espacio más cómodo y protegido con un toque de
            distinción.
          </p>
          <Link href="/contacto">
            <Button size="lg">Cotizar ahora</Button>
          </Link>
        </div>
        <div className="md:w-1/2 w-full">
          <Image
            src="/global/wcg/img-8.webp"
            alt="imagen-sunroof"
            width={800}
            height={800}
            className="rounded-xl w-full h-auto"
          />
        </div>
      </div>

      <Tabs defaultValue="tipos" className="w-full max-w-6xl mt-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tipos">Detalle</TabsTrigger>
          <TabsTrigger value="beneficios">Beneficios</TabsTrigger>
          <TabsTrigger value="proceso">Proceso de Instalación</TabsTrigger>
        </TabsList>
        <TabsContent value="tipos">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {["Detalle", "Que dice la ley"].map((tipo) => (
              <Card key={tipo}>
                <CardHeader>
                  <CardTitle>{tipo}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tipo === "Detalle" ? (
                    <p>
                      En Autovidrios V&F en conjunto con World Class Glass,
                      somos expertos en brindarle seguridad y elegancia para
                      vehículo. Mejora el estilo y la protección de tu vehículo
                      con nuestros servicios de polarizado en Bogotá. Ofrecemos
                      soluciones que no solo realzan la estética, sino que
                      también protegen el interior contra los dañinos rayos
                      solares y aumentan tu privacidad. Utilizamos materiales
                      premium y tecnología avanzada para garantizar un acabado
                      impecable y duradero. Nuestro polarizado cumple con las
                      normativas locales, asegurando un equilibrio perfecto
                      entre elegancia y legalidad. Convierte tu vehículo en un
                      espacio más cómodo y protegido con un toque de distinción.
                    </p>
                  ) : tipo === "Que dice la ley" ? (
                    <>
                      <section>
                        <p>
                          Regulación del Uso de Vidrios Polarizados en Colombia
                        </p>
                        <p>
                          En Colombia, el uso de vidrios polarizados en
                          vehículos está regulado por la{" "}
                          <strong>Resolución 3777 de 2003</strong> del
                          Ministerio de Transporte. Según esta normativa, solo
                          se permite la instalación de polarizados que cumplan
                          con los niveles de luminosidad autorizados,
                          garantizando el cumplimiento de la ley sin necesidad
                          de permisos adicionales.
                        </p>
                        <p>Niveles de Luminosidad Permitidos</p>
                        <ul>
                          <li>
                            <strong>
                              Parabrisas y vidrios de puertas delanteras:
                            </strong>{" "}
                            Luminosidad superior o igual al 70%.
                          </li>
                          <li>
                            <strong>
                              Vidrios laterales traseros y panorámico trasero:
                            </strong>{" "}
                            Luminosidad igual o superior al 55%.
                          </li>
                          <li>
                            <strong>Vehículos tipo camioneta:</strong>
                            Parabrisas y puertas delanteras con luminosidad
                            igual o superior al 70%; laterales traseros y
                            custodia trasera con luminosidad superior al 14%.
                          </li>
                        </ul>
                        <p>
                          Asegúrate de que tu vehículo cumpla con estas
                          especificaciones utilizando herramientas como
                          fotómetros y polarímetros. Cumple la normativa
                          mientras disfrutas de los beneficios del polarizado.
                        </p>
                      </section>
                    </>
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

      <section className="grid grid-cols-1 md:grid-cols-3 w-full mt-16 justify-center items-center">
        <div className="flex flex-col items-center justify-center mb-2">
          <Image
            src={"/global/wcg/img-1.webp"}
            alt="car"
            width={300}
            height={300}
            className="rounded-xl mb-6"
          />
          <span className="uppercase font-bold">CALIDAD EN INSTALACIÓN</span>
        </div>
        <div className="flex flex-col items-center justify-center mb-2">
          <Image
            src={"/global/wcg/img-2.webp"}
            alt="car"
            width={300}
            height={300}
            className="rounded-xl mb-6"
          />
          <span className="uppercase font-bold">Confianza y Calidad</span>
        </div>
        <div className="flex flex-col items-center justify-center mb-2">
          <Image
            src={"/global/wcg/img-3.webp"}
            alt="car"
            width={500}
            height={500}
            className="rounded-xl mb-6"
          />
          <span className="uppercase font-bold">Confianza y Calidad</span>
        </div>
      </section>
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
              Solicite ahora su cotización personalizada y reciba asesoría de
              nuestros expertos certificados.
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

export default ProductPagePolarizados;
