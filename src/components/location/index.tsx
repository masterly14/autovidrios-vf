'use client'

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from 'lucide-react';

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <p>Map loading...</p>,
});

const locations = [
  {
    id: 1,
    name: "Nueva sede",
    address: "Cra 64 #28-46"
  },
  {
    id: 2,
    name: "Sede Principal",
    address: "Calle 63B #28-25"
  }
];

const coordinates: [number, number] = [4.657439, -74.071124];

const MapComponent: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">¡Visítanos!</h2>
      <div className="mb-4">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => setSelectedLocation(location)}
            className={`flex items-center justify-center w-full p-2 mb-2 rounded-md ${
              selectedLocation.id === location.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className={`mr-2 ${selectedLocation.id === location.id ? 'text-white' : 'text-blue-500'}`} />
            <span>{location.name}: {location.address}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center mb-4">
        <MapPin className="text-blue-500 mr-2" />
        <p className="text-gray-700">{selectedLocation.address}</p>
      </div>
      <Map 
        address={selectedLocation.address} 
        coordinates={coordinates}
        className="rounded-md overflow-hidden shadow-md"
      />
    </div>
  );
};

export default MapComponent;

