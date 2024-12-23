"use client";

import { Facebook, Instagram, Menu } from "lucide-react";
import React from "react";
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

const NavBarComponent = () => {
  const path = usePathname();

  return (
    <div className="top-0 w-full flex h-[100px] md:h-[120px]">
      <div className="md:flex hidden justify-between w-full pr-2 pl-4">
        <div className="flex items-center justify-center gap-x-3">
          <Image
            src={"/logos/Autovidrios-V&F.png"}
            alt="logo-autovidrios-v&f"
            width={150}
            height={100}
            className="object-cover"
          />
          <Image
            src={"/logos/wcg.png"}
            alt="logo-wcg"
            width={100}
            height={100}
            className="rounded-2xl"
          />
        </div>
        <div className="flex items-center space-x-6">
          <Link href={"/"} className={`${path === "/" ? "text-white" : 'text-muted-foreground'} uppercase`}>
            Inicio
          </Link>
          <Link
            href={"/sobre-nosotros"}
            className={`${path === "/sobre-nosotros" ? "text-white": 'text-muted-foreground'} uppercase`}
          >
            Sobre nosotros
          </Link>
          <Link
            href={"/contacto"}
            className={`${path === "/contacto" ? "text-white": 'text-muted-foreground'} uppercase`}
          >
            Contacto
          </Link>
          <Link
            href={"/productos"}
            className={`${path === "/productos" ? "text-white" : 'text-muted-foreground'} uppercase`}
          >
            Productos
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-muted p-2 flex">
            WhatsApp 
          </Button>
          <div className="flex gap-x-4">
            <Instagram />
            <Facebook />
            <SvgTiktokIcon />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-between w-full p-4">
        <div className="flex items-center justify-center gap-x-3">
          <Image
            src={"/logos/Autovidrios-V&F.png"}
            alt="logo-autovidrios-v&f"
            width={100}
            height={70}
            className="object-cover"
          />
          <Image
            src={"/logos/wcg.png"}
            alt="logo-wcg"
            width={80}
            height={50}
            className="rounded-2xl"
          />
        </div>
        <div className="gap-x-3 flex items-center justify-center">
          <Button className="bg-muted p-2 flex">
            WhatsApp <WhatsAppDuoToneBlue />
          </Button>
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex gap-x-6">
                <WhatsAppDuoToneBlue />
                <SvgTiktokIcon />
                  <Instagram />
                  <Facebook />
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
                <Link
                  href={"/productos"}
                  className={`${path === "/productos" && "text-white"}`}
                >
                  Productos
                </Link>
              </SheetDescription>
              <div className="justify-end -mt-28">
                <div className="flex items-center justify-center gap-x-3">
                  <Image
                    src={"/logos/Autovidrios-V&F.png"}
                    alt="logo-autovidrios-v&f"
                    width={100}
                    height={70}
                    className="object-cover"
                  />
                  <Image
                    src={"/logos/wcg.png"}
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
