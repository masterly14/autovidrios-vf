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

const ProductPagePlumillas = () => {
  return (
    <div className="w-full min-h-screen flex flex-col mx-auto items-center justify-start md:p-0 p-5 text-white">
      <div className="flex flex-col md:flex-row gap-x-10 w-full max-w-6xl mt-10">
        <div className="flex flex-col gap-y-7 md:w-1/2 w-full mb-10 mt-10">
          <h1>
            Plumillas para carro de la mejor calidad en Bogotá
          </h1>
          <p className="text-gray-300">
            En Autovidrios V&F, en alianza con World Class Glass, somos los
            expertos en venta e instalación de plumillas para vehículos, con más de 20 años de experiencia. 
            Ofrecemos plumillas de las mejores marcas del mercado como Youwin, KTC y otras marcas reconocidas, 
            garantizando visibilidad perfecta y seguridad en cada viaje. Nuestras plumillas están diseñadas 
            para resistir las condiciones climáticas de Bogotá y brindar un rendimiento excepcional.
          </p>
          <Link href="/contacto">
            <Button size="lg">Cotizar ahora</Button>
          </Link>
        </div>
        <div className="md:w-1/2 w-full">
          <Image
            src="/global/wcg/img-8.webp"
            alt="Plumillas para carro"
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
            {["Calidad Premium", "Variedad de Marcas"].map((tipo) => (
              <Card key={tipo}>
                <CardHeader>
                  <CardTitle>{tipo}</CardTitle>
                </CardHeader>
                <CardContent>
                  {tipo === "Calidad Premium" ? (
                    <p>
                      En Autovidrios V&F en conjunto con World Class Glass, 
                      ofrecemos plumillas de la más alta calidad para su vehículo. 
                      Nuestras plumillas están fabricadas con materiales premium 
                      que garantizan un rendimiento superior, resistencia a la 
                      intemperie y durabilidad excepcional. Cada plumilla está 
                      diseñada para proporcionar una limpieza perfecta del parabrisas, 
                      mejorando significativamente la visibilidad y seguridad al conducir.
                    </p>
                  ) : tipo === "Variedad de Marcas" ? (
                    <p>
                      Trabajamos con las mejores marcas del mercado como Youwin, 
                      KTC y otras marcas reconocidas internacionalmente. Cada marca 
                      ofrece características específicas: Youwin con su tecnología 
                      AERO CONCEPT para mayor eficiencia, KTC con su durabilidad 
                      comprobada, y otras marcas que garantizan la compatibilidad 
                      perfecta con su vehículo. Tenemos plumillas en todos los 
                      tamaños estándar desde 16" hasta 24".
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
            <li>Visibilidad perfecta en todas las condiciones climáticas</li>
            <li>Instalación profesional garantizada</li>
            <li>Plumillas de marcas reconocidas y confiables</li>
            <li>Durabilidad excepcional y resistencia a la intemperie</li>
            <li>Compatibilidad garantizada con su modelo de vehículo</li>
            <li>Precios competitivos y asesoría especializada</li>
          </ul>
        </TabsContent>
        <TabsContent value="proceso">
          <ol className="list-decimal pl-5 mt-6 space-y-2">
            <li>Evaluación del modelo y año de su vehículo</li>
            <li>Selección de la marca y tipo de plumilla adecuada</li>
            <li>Verificación de compatibilidad y medidas exactas</li>
            <li>Instalación profesional por técnicos especializados</li>
            <li>Pruebas de funcionamiento y ajuste perfecto</li>
            <li>Entrega con garantía y recomendaciones de mantenimiento</li>
          </ol>
        </TabsContent>
      </Tabs>
     
     <section className="grid grid-cols-1 md:grid-cols-3 w-full mt-16 justify-center items-center">
        <div className="flex flex-col items-center justify-center mb-2">
        <Image src={'/global/wcg/img-1.webp'} alt="Plumillas Youwin" width={300} height={300} className="rounded-xl mb-6"/>
        <span className="uppercase font-bold">CALIDAD PREMIUM</span>
        </div>
        <div className="flex flex-col items-center justify-center mb-2">
        <Image src={'/global/wcg/img-2.webp'} alt="Plumillas KTC" width={300} height={300} className="rounded-xl mb-6"/>
        <span className="uppercase font-bold">MARCAS RECONOCIDAS</span>
        </div>
        <div className="flex flex-col items-center justify-center mb-2">
        <Image src={'/global/wcg/img-3.webp'} alt="Instalación profesional" width={500} height={500} className="rounded-xl mb-6"/>
        <span className="uppercase font-bold">INSTALACIÓN PROFESIONAL</span>
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
              q: "¿Cómo sé qué plumillas necesito para mi carro?",
              a: "Nuestros técnicos especializados evalúan su vehículo para determinar el tamaño exacto y la marca más adecuada. También puede consultar el manual de su vehículo o contactarnos para asesoría personalizada.",
            },
            {
              q: "¿Cuánto tiempo duran las plumillas?",
              a: "La duración depende del uso y las condiciones climáticas. En promedio, las plumillas de calidad premium duran entre 6 a 12 meses. Recomendamos revisarlas cada 3 meses y cambiarlas cuando muestren signos de desgaste.",
            },
            {
              q: "¿Ofrecen garantía en las plumillas?",
              a: "Sí, ofrecemos garantía en la instalación y en los productos. Nuestras plumillas vienen con garantía del fabricante y nosotros garantizamos la instalación profesional sin daños al vehículo.",
            },
            {
              q: "¿Tienen plumillas para todas las marcas de carros?",
              a: "Trabajamos con las principales marcas del mercado y tenemos plumillas compatibles con la mayoría de vehículos. Si no tenemos el modelo específico, podemos conseguirlo en un plazo corto.",
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
            <CardTitle>¿Necesita plumillas nuevas para su vehículo?</CardTitle>
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

export default ProductPagePlumillas;
