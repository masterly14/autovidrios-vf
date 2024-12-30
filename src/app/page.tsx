import AutoCarousel from "@/components/carousel/component";
import Chatbot from "@/components/chatbot";
import CarouselComponent from "@/components/hero";
import { HeroParallaxDemo } from "@/components/hero-parallax/component";
import MainLocation from "@/components/location";
import OurServices from "@/components/offer/our-services";
import Testimonials from "@/components/testimonial/testimonial-section";
import { WorldMapDemo } from "@/components/world-map/component";

export default function Home() {
  return (
    <div>
      <CarouselComponent />
      <AutoCarousel />
      <OurServices />
      <div className="md:mt-0 -mt-28">
        <WorldMapDemo />
      </div>
      <div className="bg-black">
        <HeroParallaxDemo />
      </div>
      <Testimonials />
      <div className="mb-10">
        <MainLocation />
      </div>
      <Chatbot />
    </div>
  );
}
