import React from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface Address {
  id: string;
  name: string;
  address: string;
}

interface GoogleMapsLinkProps {
  address: Address;
  className?: string;
}

const GoogleMapsLink: React.FC<GoogleMapsLinkProps> = ({
  address,
  className = "",
}) => {
  const encodedAddress = encodeURIComponent(address.address);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const wazeUrl = `https://www.waze.com/ul?q=${encodedAddress}`;

  return (
    <div className={`p-4 border rounded-lg shadow ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Selecciona una opción para abrir el mapa:
      </h2>
      <div className="flex flex-col space-y-2">
        <Link
          href={
            address.address === "Cl. 63b #28-25"
              ? "https://maps.app.goo.gl/ZAafvkFGvp2MkTv76"
              : googleMapsUrl
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center transition-colors duration-200"
        >
          <Button variant={"outline"} className="p-5">
            <Image
              src={"/global/logos-mapas/maps.png"}
              alt="logo-waze"
              width={30}
              height={30}
            />
            <span>
              Abrir en Google Maps: {address.name} - {address.address}{" "}
              {address.address === "Cl. 63b #28-25" && ""}
            </span>
          </Button>
        </Link>
        <Link
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center transition-colors duration-200 gap-x-3"
        >
          <Button variant={"outline"} className="p-5">
            <Image
              src={"/global/logos-mapas/waze.png"}
              alt="logo-waze"
              width={30}
              height={30}
              className="rounded-full"
            />
            <span>
              Abrir en Waze: {address.name} - {address.address}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GoogleMapsLink;
