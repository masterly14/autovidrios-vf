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

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 ${className}`}
    >
      <MapPin className="w-5 h-5 mr-2" />
      <span>{address.name} - {address.address}</span>
      
    </a>
  );
};

export default GoogleMapsLink;

