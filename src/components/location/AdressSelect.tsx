'use client'

import React, { useState } from 'react';
import GoogleMapsLink from './GoogleMapsLink';

interface Address {
  id: string;
  name: string;
  address: string;
}

interface AddressSelectorProps {
  addresses: Address[];
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ addresses }) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  return (
    <div className="space-y-4">
      <select
        className="w-full p-2 border border-gray-300 bg-black rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        onChange={(e) => {
          const selected = addresses.find(addr => addr.id === e.target.value);
          setSelectedAddress(selected || null);
        }}
        value={selectedAddress?.id || ''}
      >
        <option value="" className='text-white'>Selecciona una dirección</option>
        {addresses.map((addr) => (
          <option key={addr.id} value={addr.id}>
            {addr.name}
          </option>
        ))}
      </select>
      {selectedAddress && (
        <div className="mt-4">
          <GoogleMapsLink address={selectedAddress} className="text-lg" />
        </div>
      )}
    </div>
  );
};

export default AddressSelector;

