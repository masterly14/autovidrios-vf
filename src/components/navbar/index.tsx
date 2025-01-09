"use client";

import { Facebook, Instagram, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import WhatsAppDuoToneBlue from "../icons/whatsapp-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SvgTiktokIcon from "../icons/tiktok-icon";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const NavBarComponent = () => {
  const path = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setSheetOpen(false);
  }, [path]);

  return (
    <div className="top-0 w-full flex h-[100px] md:h-[120px] bg-black">
      <div className="md:flex hidden justify-between w-full pr-2 pl-4">
        <div className="flex items-center justify-center gap-x-3">
          <Image
            src={"/logos/Autovidrios-V&F.webp"}
            alt="logo-autovidrios-v&f"
            width={150}
            height={100}
            className="object-cover"
          />
          <Image
            src={"/logos/wcg.webp"}
            alt="logo-wcg"
            width={100}
            height={100}
            className="rounded-2xl"
          />
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href={"/"}
            className={`${
              path === "/" ? "text-white" : "text-muted-foreground"
            } uppercase`}
          >
            Inicio
          </Link>
          <Link
            href={"/sobre-nosotros"}
            className={`${
              path === "/sobre-nosotros"
                ? "text-white"
                : "text-muted-foreground"
            } uppercase`}
          >
            Sobre nosotros
          </Link>
          <Link
            href={"/contacto"}
            className={`${
              path === "/contacto" ? "text-white" : "text-muted-foreground"
            } uppercase`}
          >
            Contacto
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="border-none bg-transparent uppercase">
                Productos y Servicios
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Link href={"/servicios-productos/vidrios-para-vehiculo"}>
                Vidrios para vehículo
              </Link>
              <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
              <Link href={"/servicios-productos/instalacion-sunroof"}>
                Instalación Sunroof
              </Link>
              <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
              <Link href={"/servicios-productos/instalacion-vidrios-blindados"}>
                Vidrios Blindados
              </Link>
              <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
              <Link href={"/servicios-productos/polarizados"}>Polarizados</Link>
              <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
              <Link href={"/servicios-productos/instalacion-pelicula-antirobo"}>
                Pelicula Antirobo
              </Link>
              <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center space-x-4">
          <Link href={"https://wa.link/14qlpa"}>
            <Button className="bg-muted p-2 flex">
              WhatsApp <WhatsAppDuoToneBlue />
            </Button>
          </Link>
          <div className="flex gap-x-4">
            <Link href={"https://www.instagram.com/world_class_glass/"}>
              <Instagram />
            </Link>
            <Link
              href={"https://www.facebook.com/profile.php?id=61571166966495"}
            >
              <Facebook />
            </Link>
            <Link
              href={
                "https://www.tiktok.com/@world_class_glass?_t=8sb8NZrpBNw&_r=1"
              }
            >
              <SvgTiktokIcon />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-between w-full p-4">
        <div className="flex items-center justify-center gap-x-3">
          <Image
            src={"/logos/Autovidrios-V&F.webp"}
            alt="logo-autovidrios-v&f"
            width={100}
            height={70}
            className="object-cover"
          />
          <Image
            src={"/logos/wcg.webp"}
            alt="logo-wcg"
            width={80}
            height={50}
            className="rounded-2xl"
          />
        </div>
        <div className="gap-x-3 flex items-center justify-center">
          <Link href={"https://wa.link/14qlpa"}>
            <Button className="bg-muted p-2 flex">
              WhatsApp <WhatsAppDuoToneBlue />
            </Button>
          </Link>

          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex gap-x-6">
                  <Link href={"https://wa.link/14qlpa"}>
                    <WhatsAppDuoToneBlue />
                  </Link>
                  <Link
                    href={
                      "https://www.tiktok.com/@world_class_glass?_t=8sb8NZrpBNw&_r=1"
                    }
                  >
                    <SvgTiktokIcon />
                  </Link>
                  <Link href={"https://www.instagram.com/world_class_glass/"}>
                    <Instagram />
                  </Link>
                  <Link
                    href={
                      "https://www.facebook.com/profile.php?id=61571166966495"
                    }
                  >
                    <Facebook />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <SheetDescription className="flex flex-col gap-y-10 items-center justify-center h-full">
                <Link href={"/"} className={`${path === "/" && "text-white"}`}>
                  Inicio
                </Link>
                <Link
                  href={"/sobre-nosotros"}
                  className={`${path === "/sobre-nosotros" && "text-white"}`}
                >
                  Sobre nosotros
                </Link>
                <Link
                  href={"/contacto"}
                  className={`${path === "/contacto" && "text-white"}`}
                >
                  Contacto
                </Link>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="border-none bg-transparent">
                      Productos y Servicios
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Link href={"/servicios-productos/vidrios-para-vehiculo"}>
                      Vidrios para vehículo
                    </Link>
                    <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
                    <Link href={"/servicios-productos/instalacion-sunroof"}>
                      Instalación Sunroof
                    </Link>
                    <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
                    <Link
                      href={
                        "/servicios-productos/instalacion-vidrios-blindados"
                      }
                    >
                      Vidrios Blindados
                    </Link>
                    <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
                    <Link href={"/servicios-productos/polarizados"}>
                      Polarizados
                    </Link>
                    <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
                    <Link
                      href={
                        "/servicios-productos/instalacion-pelicula-antirobo"
                      }
                    >
                      Pelicula Antirobo
                    </Link>
                    <div className="h-[1px] rounded-full bg-white w-[160px] mb-2"></div>
                  </PopoverContent>
                </Popover>
              </SheetDescription>
              <div className="justify-end -mt-28">
                <div className="flex items-center justify-center gap-x-3">
                  <Image
                    src={"/logos/Autovidrios-V&F.webp"}
                    alt="logo-autovidrios-v&f"
                    width={100}
                    height={70}
                    className="object-cover"
                  />
                  <Image
                    src={"/logos/wcg.webp"}
                    alt="logo-wcg"
                    width={80}
                    height={50}
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default NavBarComponent;
