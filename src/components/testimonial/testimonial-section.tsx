import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const testimonials = [
  {
    name: "María García",
    text: "Recomiendo al 100% a Autovidrios V&F por su servicio de instalación de vidrios blindados para vehículos. Me brindaron asesoría personalizada y una atención excelente. La calidad del blindaje y la instalación superó mis expectativas. ¡Servicio profesional y confiable!",
    rating: 5,
  },
  {
    name: "Juan Pérez",
    text: "Autovidrios V&F instaló el panorámico delantero y trasero de mi carro hace un año y siguen en perfecto estado. Excelente calidad en vidrios automotrices importados y un servicio técnico muy detallado. ¡Altamente recomendados!",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    text: "Desde que llegué a Autovidrios V&F, me asesoraron sobre qué tipo de vidrio era ideal para mi vehículo. La instalación fue profesional y rápida. Es una empresa seria en el servicio de vidrios para carro. Muy satisfechos con su trabajo.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    text: "Los vidrios que manejan en Autovidrios V&F son importados de excelente calidad. El proceso de importación fue ágil y me ofrecieron una instalación de vidrios muy profesional. ¡Todo quedó perfecto!",
    rating: 5,
  },
  {
    name: "Laura Sánchez",
    text: "Estoy muy contenta con el polarizado de mi vehículo. Autovidrios V&F me ofreció polarizados de alta calidad, con protección solar y excelente acabado. Además, el equipo fue muy atento durante todo el proceso.",
    rating: 5,
  },
  {
    name: "Santiago Ramírez",
    text: "La experiencia fue excelente. Me instalaron vidrios blindados en mi camioneta con un proceso muy bien explicado y materiales de primera. El equipo técnico de Autovidrios V&F es muy profesional. Recomiendo sus servicios sin dudarlo.",
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
                {testimonial.text}
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
