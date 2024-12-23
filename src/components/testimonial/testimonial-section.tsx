import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
    text: "Los tiempos de importación son bastante rápidos, y la calidad ni hablar. Los trabajadores de Autovidrios V&F son muy amables y atentos.",
    rating: 5,
  },
  {
    name: "Santiago Ramírez",
    text: "La experiencia con Autovidrios V&F fue excelente, me explicaron todo el proceso de instalación de los vidrios de mi camioneta y se aseguraron de que todo quedara perfecto. La calidad de los materiales es increíble, y el equipo fue muy profesional en todo momento. Definitivamente volvería a confiar en ellos.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-primary">
        Lo que opinan nuestros clientes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-card"
          >
            <CardContent className="pt-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "text-primary fill-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-card-foreground italic mb-4">
                "{testimonial.text}"
              </p>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <p className="font-semibold text-primary">{testimonial.name}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
