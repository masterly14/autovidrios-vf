import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NavBarComponent from "@/components/navbar";
import Footer from "@/components/footer";

const montserrat = Montserrat({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: {
    default:
      "Venta de vidrios para carros originales e importados para vehículos",
    template:
      "%s - Venta de vidrios originales e importados para vehículos en Bogotá",
  },
  description:
    "Proporcionamos servicios en venta, instalación y mantenimiento de vidrios para vehículos de todas las marcas en Bogotá.",
  metadataBase: new URL("https://autovidriosvf.com/"),
  openGraph: {
    title: "Autovidrios V&F - World Class Glass",
    description: "Venta de vidrios originales e importados para vehiculo, instalacion y mantenimiento de vidrios para vehiculos de todas las marcas en Bogota, y mucho más.",
    url: "https://autovidriosvf.com/",
    siteName: "Autovidrios V&F - World Class Glass",
    images: [
      {
        url: "https://res.cloudinary.com/djhbeecge/image/upload/v1735539463/obvoonzhyzgkhud5qiwu.webp",
        width: 800,
        height: 600,
        alt: "Autovidrios V&F - World Class Glass",
      }
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <NavBarComponent />
        {children}
        <Footer />
      </body>
    </html>
  );
}
