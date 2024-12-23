import ImageCarousel from "./carousel";

const carouselItems = [
  {
    imageUrl: "/hero/autovidrios-wcg.png",
    text: "Bienvenido a World Class Glass",
    buttonText: "Conocer más",
    buttonLink: "/alianza", //WIP: Página de alianza con Autovidrios V&F y World Class Glass
    subtitle:
      "Hemos cambiado para mejorar, ahora nos hemos unido con World Class Glass. ¡Conoce más!",
  },
  {
    imageUrl: "/hero/suv-blindada.png",
    text: "La seguridad es lo primero",
    buttonText: "Conocer más",
    buttonLink: "/productos/vidrios-blindados", // WIP: Página de productos
    subtitle:
      "Con nosotros puedes instalar un vidrio blindado ultraseguro o, darle mantenimiento a tu vehiculo blindado ¡Conoce más!",
  },
  {
    imageUrl: "/hero/sunroof.jpg",
    text: "Disfruta de la vista",
    buttonText: "Conocer más",
    buttonLink: "/productos/sunroof",
    subtitle:
      "Instalamos sunroofs de la mejor calidad y con la mejor garantía. ¡Conoce más!",
  },
  {
    imageUrl: "/hero/vidrios-importados.png",
    text: "Importación de vidrios americanos",
    buttonText: "Conocer más",
    buttonLink: "/productos/sunroof",
    subtitle:
      "Contamos con los mejores vidrios importados de Estados Unidos y nos caracterizamos por entrega rápida. ¡Conoce más!",
  },
];

export default function CarouselComponent() {
  return (
    <main>
      <ImageCarousel items={carouselItems} autoChangeInterval={7000} />
    </main>
  );
}
