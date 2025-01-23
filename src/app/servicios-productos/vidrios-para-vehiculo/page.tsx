import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedCounter from "@/components/counter";
import UnionSection from "@/components/auto-world";
import MainLocation from "@/components/location";
import { Metadata } from "next";
import BackgroundImageWithText from "@/components/image-vidrios-vehiculo";

const metadata: Metadata = {
  title: "Vidrios para vehiculo en Bogotá",
  description:
    "Vidrios para vehículo en Bogotá, expertos en la instalación de vidrios para vehículo, manejamos los mejores vidrios del mercado. Con más de 10 años de experiencia, Autovidrios V&F en conjunto con World Class Glass manejamos vidrios originales e importados",
};

const page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full items-center justify-center flex bg-white flex-col">
        <h1 className="text-4xl text-black font-bold m-6">
          Vidrios para vehículo
        </h1>
        <span className="p-5 text-center font-semibold text-black">
          Expertos en la instalación de vidrios para vehículo, manejamos los
          mejores vidrios del mercado. Con más de 10 años de experiencia,
          Autovidrios V&F en conjunto con World Class Glass manejamos vidrios{" "}
          <span className="font-bold">originales</span> e{" "}
          <span className="font-bold">importados</span>
        </span>
        <Link href={"/contacto"} className="mb-10">
          <Button>Contactar</Button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 p-4">
        <div className="w-full md:w-1/3">
          <Image
            src="/global/image-1.jpg"
            alt="Imagen 1"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Image
            src="/global/image-4.jpg"
            alt="Imagen 2"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Image
            src="/global/image-3.jpg"
            alt="Imagen 3"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
      <div className="w-full mt-6 p-5 mb-3">
        <Tabs defaultValue="tipos" className="w-full max-w-6xl mt-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tipos" className="">
              Detalle
            </TabsTrigger>
            <TabsTrigger value="beneficios">Beneficios</TabsTrigger>
            <TabsTrigger value="proceso">Proceso de Instalación</TabsTrigger>
          </TabsList>
          <TabsContent value="tipos">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {["Calidad", "Mantenimiento"].map((tipo) => (
                <Card key={tipo}>
                  <CardHeader>
                    <CardTitle>{tipo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tipo === "Calidad" ? (
                      <p>
                        En Autovidrios V&F en conjunto con World Class Glass,
                        somos expertos en brindarle lo mejor para vehículo.
                        Brindamos la solución adecuada y específica para los
                        requerimientos de cada uno de nuestros clientes.
                      </p>
                    ) : tipo === "Mantenimiento" ? (
                      <p>
                        Muchas veces, la instalación de un vidrio nuevo blindado
                        puede ser más costoso y requerir más tiempo, por eso
                        nuestra pelicula antirobo, es la mejor opción para
                        brindarle seguridad a un excelente precio y de la mejor
                        calidad. Le aseguramos que usted, su familia y sus
                        pertenencias estarán seguras con nuestra pelicula
                        antirobo de excelente calidad.
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
      </div>
      <UnionSection />
      <BackgroundImageWithText
        imageUrl="/hero/contenedores.webp"
        title="Importamos vidrios americanos"
        description="Nos caracteriza nuestra calidad, por eso podemos importar los mejores vidrios del mercado directamente desde Estados Unidos para que su vehículo tenga lo mejor."
      />
      <AnimatedCounter />
      <Image
        src={"/global/imagenes-referencia.webp"}
        alt="imagen"
        width={1920}
        height={1080}
        className="object-cover"
      />
      <div className="mt-10 mb-10">
        <MainLocation />
      </div>
    </div>
  );
};

export default page;
 