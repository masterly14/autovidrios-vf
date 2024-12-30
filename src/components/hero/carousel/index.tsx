"use client";
import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselItem {
  imageUrl: string;
  text: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
  autoChangeInterval?: number;
}

const CarouselItem: React.FC<CarouselItem & { isActive: boolean }> = ({
  imageUrl,
  text,
  subtitle,
  buttonText,
  buttonLink,
  isActive,
}) => (
  <div
    className={`absolute inset-0 transition-opacity duration-1000 ${
      isActive ? "opacity-100" : "opacity-0"
    }`}
  >
    <div className="relative w-full h-full">
      <Image
        src={imageUrl}
        alt={text}
        fill
        sizes="(max-width: 768px) 100vw, 100vw"
        priority
        className="object-cover"
      />
    </div>
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white p-4">
      <div className="w-full max-w-7xl mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-center">
          {text}
        </h1>
        {subtitle && (
          <p className="text-sm md:text-xl mb-4 text-center max-w-[300px] md:max-w-[500px] mx-auto">
            {subtitle}
          </p>
        )}
        <div className="text-center">
          <Button asChild className="mt-4">
            <a href={buttonLink}>{buttonText}</a>
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  items,
  autoChangeInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true); // Pausar el auto-slide cuando el usuario toca
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
    setIsPaused(false); // Reanudar el auto-slide cuando el usuario termina de tocar
  };

  // Efecto para el cambio automático de diapositivas
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, autoChangeInterval);

      return () => clearInterval(interval);
    }
  }, [nextSlide, autoChangeInterval, isPaused]);

  return (
    <div
      className="relative w-full h-[50vh] md:h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)} // Pausar en hover
      onMouseLeave={() => setIsPaused(false)} // Reanudar al quitar el hover
    >
      {items.map((item, index) => (
        <CarouselItem key={index} {...item} isActive={index === currentIndex} />
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;