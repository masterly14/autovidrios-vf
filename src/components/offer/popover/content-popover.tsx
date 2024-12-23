import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  imageUrl: string;
};

const ContentPopover = ({ imageUrl }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <p>Imagen de referencia</p>
      <Image src={`/global/${imageUrl}`} alt={imageUrl} width={150} height={150} />
      <Link href={'/contact'}>
      <Button size={"sm"}>Cotizar para mi vehículo</Button>
      </Link>
    </div>
  );
};

export default ContentPopover;
