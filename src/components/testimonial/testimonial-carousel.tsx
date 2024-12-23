import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TestimonialCard } from "./testimonial-card";

const testimonials = [
  {
    name: "María García",
    text: "Sin duda alguna recomiendo al 100% a Autovidrios V&F, desde la asesoria que me dieron hasta la atención por parte de su personal me ayudaron a blindar los vidrios de mi vehiculo lo que necesitaba especificamente,totalmente recomendado",
    rating: 5,
  },
  {
    name: "Juan Pérez",
    text: "Desde el primer momento me ayudaro con todos los minimos detalles sobre lo que le realizaron a mi vehiculo, hasta el momento llevo 1 año con el panoramico delantero y trasero que ellos me instalaron, No he tenido el más minimo inconveniente",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    text: "Los muchachos de Autovidrios V&F se esfierzan por brindar un servicio de calidad, desde el primer momento que llegue a sus instalaciones me brindaron la mejor atención, me ayudaron a elegir el vidrio que mejor se adaptaba a mi vehiculo, sin duda alguna los recomiendo",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    text: "Los vidrios que manejan en autovidrios V&F son de la mejor calidad, me ayudaron a elegir el vidrio que mejor se adaptaba a mi vehiculo, y la importación fue muy rápida, la verdad quede muy satisfecho de su servicio.",
    rating: 5,
  },
  {
    name: "Laura Sánchez",
    text: "Increíble atención al cliente. Me encantó.",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto"
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <TestimonialCard {...testimonial} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
