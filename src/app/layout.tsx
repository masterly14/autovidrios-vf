import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NavBarComponent from "@/components/navbar";
import Footer from "@/components/footer";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Vidrios para vehículo",
  description:
    "Venta, instalación y mantenimiento de vidrios para vehículos de todas las marcas en Bogotá.",
  metadataBase: new URL("https://autovidriosvf.com/"),
  openGraph: {
    title: "Autovidrios V&F - World Class Glass",
    description:
      "Venta de vidrios originales e importados para vehiculo, instalacion y mantenimiento de vidrios para vehiculos de todas las marcas en Bogota, y mucho más.",
    url: "https://autovidriosvf.com/",
    siteName: "Autovidrios V&F - World Class Glass",
    images: [
      {
        url: "https://res.cloudinary.com/djhbeecge/image/upload/v1735539463/obvoonzhyzgkhud5qiwu.webp",
        width: 800,
        height: 600,
        alt: "Autovidrios V&F - World Class Glass",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Autovidrios V&F - World Class Glass",
    image:
      "https://res.cloudinary.com/djhbeecge/image/upload/v1756733699/Dise%C3%B1o_sin_t%C3%ADtulo_6_zfwwlc.png",
    "@id": "https://autovidriosvf.com/",
    url: "https://autovidriosvf.com/",
    telephone: "+57-3113688995", 
    priceRange: "COP$$$", 
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cl. 64 #28-46, Bogotá", // <-- ¡AÑADE TU DIRECCIÓN!
      addressLocality: "Bogotá",
      postalCode: "1102", // <-- ¡AÑADE TU CÓDIGO POSTAL!
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 4.65787504500003,
      longitude: -74.075395078,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "07:00", // <-- Revisa y ajusta
      closes: "18:00", // <-- Revisa y ajusta
    },
  };
  return (
    <html lang="es">
      <body className={`${montserrat.className} antialiased`}>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NavBarComponent />
        {children}
        <Footer />
      </body>
    </html>
  );
}
