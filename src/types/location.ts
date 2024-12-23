export interface Location {
    id: number;
    name: string;
    address: string;
    coordinates: [number, number];
  }
  
  export const locations: Location[] = [
    {
      id: 1,
      name: "Sede Principal",
      address: "Cra 10 Bis#2-16 Sur",
      coordinates: [4.657439, -74.071124]
    },
    {
      id: 2,
      name: "Sede Secundaria",
      address: "Calle 63B #28-25",
      coordinates: [4.658439, -74.072124]
    }
  ];
  
  