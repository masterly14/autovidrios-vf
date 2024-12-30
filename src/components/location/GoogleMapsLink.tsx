import React from 'react';
import { MapPin } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  address: string;
}

interface GoogleMapsLinkProps {
  address: Address;
  className?: string;
}

const GoogleMapsLink: React.FC<GoogleMapsLinkProps> = ({ address, className = '' }) => {
  const encodedAddress = encodeURIComponent(address.address);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const wazeUrl = `https://www.waze.com/ul?q=${encodedAddress}`;

  return (
    <div className={`p-4 border rounded-lg shadow ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Selecciona una opción para abrir el mapa:
      </h2>
      <div className="flex flex-col space-y-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <MapPin className="w-5 h-5 mr-2" />
          <span>Google Maps: {address.name}</span>
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
        >
          <MapPin className="w-5 h-5 mr-2" />
          <span>Waze: {address.name}</span>
        </a>
      </div>
    </div>
  );
};

export default GoogleMapsLink;

