import ImageCarousel from "./carousel";

const carouselItems = [
  {
    imageUrl: "/hero/contenedores.webp",
    text: "Importación de vidrios americanos para vehículo",
    buttonText: "Conocer más",
    buttonLink: "/#productos",
    subtitle:
      "Contamos con los mejores vidrios importados de Estados Unidos y nos caracterizamos por entrega rápida. ¡Conoce más!",
  },
  {
    imageUrl: "/hero/autovidrios-wcg.png",
    text: "Bienvenido a World Class Glass",
    buttonText: "Conocer más",
    buttonLink: "/sobre-nosotros",
    subtitle:
      "Hemos cambiado para mejorar, ahora nos hemos unido con World Class Glass. ¡Conoce más!",
  },
  {
    imageUrl: "/hero/suv-blindada.png",
    text: "La seguridad es lo primero",
    buttonText: "Conocer más",
    buttonLink: "/#productos", 
    subtitle:
      "Con nosotros puedes instalar vidrios blindados o, darle mantenimiento a tu vehiculo blindado ¡Conoce más!",
  },
  {
    imageUrl: "/hero/sunroof.jpg",
    text: "Disfruta de la vista",
    buttonText: "Conocer más",
    buttonLink: "/#productos",
    subtitle:
      "Instalamos sunroofs de la mejor calidad y con la mejor garantía. ¡Conoce más!",
  },
];

export default function CarouselComponent() {
  return (
    <main>
      <ImageCarousel items={carouselItems} autoChangeInterval={7000} />
    </main>
  );
}
