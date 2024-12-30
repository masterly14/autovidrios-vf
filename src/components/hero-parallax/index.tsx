"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Configure the spring animation
  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const totalScrollWidth = 3920;

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, totalScrollWidth]), // Más tiempo para el desplazamiento
    { stiffness: 150, damping: 50 } // Resorte más "suave" y lento
  );

  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -totalScrollWidth]),
    { stiffness: 150, damping: 50 } // Configuración igual al resorte anterior
  );

  // Extender la duración del bloqueo del scroll
  const scrollLock = useTransform(scrollYProgress, (latest) => {
    if (latest <= 1) {
      // Mantener el scroll bloqueado por más tiempo
      return 0;
    }
    return (latest - 1) * 5; // Ajustar aceleración
  });

  // Other animations complete earlier in the scroll sequence
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );

  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );

  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 0]),
    springConfig
  );

  // Apply the scroll lock to the container
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    scrollLock.onChange((latest) => {
      container.style.transform = `translateY(${latest * 100}vh)`;
    });

    return () => {
      scrollLock.clearListeners();
    };
  }, [scrollLock]);

  return (
    <div ref={ref} className="md:h-[200vh] h-[150vh] overflow-hidden antialiased relative">
      <div
        ref={containerRef}
        className="sticky top-0 h-screen flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      >
        <Header />
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
          className="flex-1 flex flex-col justify-center"
        >
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
            {firstRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row mb-20 space-x-20">
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverse}
                key={product.title}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
            {thirdRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Header and ProductCard components remain the same
export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <p className="text-2xl md:text-7xl font-bold dark:text-white">
        Algunos trabajos que
        <br /> hemos realizado
      </p>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        Galeria dinamica de lo que nos orgullece en Autovidrios V&F en conjunto
        con World Class Glass
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product relative flex-shrink-0 
             h-80 w-[20rem] 
             md:h-96 md:w-[40rem]" // Clases responsivas
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          height={600} // Tamaño inicial para pantallas grandes
          width={480}
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
