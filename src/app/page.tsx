'use client'

import AutoCarousel from "@/components/carousel/component";
import Chatbot from "@/components/chatbot";
import CarouselComponent from "@/components/hero";
import { HeroParallaxDemo } from "@/components/hero-parallax/component";
import MainLocation from "@/components/location";
import OurServices from "@/components/offer/our-services";
import Testimonials from "@/components/testimonial/testimonial-section";
import withLazyAnimation from "@/components/with-lazy-animation";
import { WorldMapDemo } from "@/components/world-map/component";

const LazyAutoCarousel = withLazyAnimation(AutoCarousel);
const LazyOurServices = withLazyAnimation(OurServices);
const LazyHeroParallaxDemo = withLazyAnimation(HeroParallaxDemo);
const LazyTestimonials = withLazyAnimation(Testimonials);
const LazyMainLocation = withLazyAnimation(MainLocation);

export default function Home() {
  return (
    <div>
      <CarouselComponent />
      <LazyAutoCarousel />
      <LazyOurServices />
      <WorldMapDemo />
      <div className="bg-black">
        <LazyHeroParallaxDemo />
      </div>
      <LazyTestimonials />
      <div className="mb-10">
        <LazyMainLocation />
      </div>
      <Chatbot />
    </div>
  );
}

