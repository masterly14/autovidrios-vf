import AddressSelector from "./AdressSelect";


const addresses = [
  { id: '1', name: 'Nueva sede', address: 'Calle 64 # 28-46  Bogotá, Colombia' },
  { id: '2', name: 'Sede principal', address: 'Calle 63b # 28-25  Bogotá, Colombia' },
];

export default function MainLocation() {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md ">
        <h1 className="text-2xl font-bold mb-4 text-black">Nuestras ubicaciones</h1>
        <AddressSelector addresses={addresses} />
      </div>
    </div>
  );
}

