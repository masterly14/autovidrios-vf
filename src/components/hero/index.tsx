import ImageCarousel from "./carousel";

const carouselItems = [
  {
    imageUrl: "/hero/contenedores.webp",
    text: "Vidrios para carro",
    buttonText: "Conocer más",
    buttonLink: "/servicios-productos/vidrios-para-vehiculo",
    subtitle:
      "Contamos con los mejores vidrios para vehículo del mercado. Calidad, garantía y profesionalismo. ¡Conoce más!",
  },
  {
    imageUrl: "/hero/autovidrios-wcg.webp",
    text: "Bienvenido a World Class Glass",
    buttonText: "Conocer más",
    buttonLink: "/sobre-nosotros",
    subtitle:
      "Hemos cambiado para mejorar, ahora nos hemos unido con World Class Glass. ¡Conoce más!",
  },
  {
    imageUrl: "/hero/suv-blindada.webp",
    text: "La seguridad es lo primero",
    buttonText: "Conocer más",
    buttonLink: "/servicios-productos/instalacion-vidrios-blindados", 
    subtitle:
      "Con nosotros puedes instalar vidrios blindados o, darle mantenimiento a tu vehiculo blindado ¡Conoce más!",
  },
  {
    imageUrl: "/hero/sunroof.webp",
    text: "Disfruta de la vista",
    buttonText: "Conocer más",
    buttonLink: "/servicios-productos/instalacion-sunroof",
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
