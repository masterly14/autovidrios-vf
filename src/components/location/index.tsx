"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneIcon as WhatsappIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import GoogleMapsLink from "./GoogleMapsLink";
import Chatbot from "../chatbot";
import Link from "next/link";

const options = [
  {
    value: "direccion1",
    label: "Nueva Sede",
    image: "/global/nueva_sede.png",
    info: "Información para la Dirección 1",
    name: "Sede nueva",
    adress: "Calle 64 #28-46",
  },
  {
    value: "direccion2",
    label: "Sede principal",
    image: "/global/logos-mapas/sede-principal.png",
    info: "Información para la Dirección 2",
    adress: "Cl. 63b #28-25",
    name: "Sede principal",
  },
];

export default function MainLocation() {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Select
            onValueChange={(value) =>
              setSelected(
                options.find((opt) => opt.value === value) || options[0]
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una dirección" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator className="my-4" />

          <div className="p-4 bg-white rounded-lg">
            <h3 className="text-lg text-black font-semibold mb-2">
              {selected.name}
            </h3>
            <GoogleMapsLink
              address={{
                address: selected.adress,
                id: "nueva sede",
                name: selected.name!,
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center">
          {selected && (
            <div className="relative w-full h-[300px]">
              <Image
                src={selected.image}
                alt={`Imagen para ${selected.label}`}
                width={700}
                height={300}
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <Link
          href="https://wa.me/3112688995"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-3 text-xs flex gap-x-2 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Contactar por WhatsApp"
        >
          <WhatsappIcon className="w-3 h-3" />
          Ir a WhatsApp
        </Link>
        <Chatbot />
      </div>
    </div>
  );
}
