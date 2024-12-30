import React from "react";
import { PopoverDemo } from "./popover-component";
import Image from "next/image";
import ContentPopover from "./content-popover";

const MainPopover = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <PopoverDemo
        Trigger="Panoramico delantero"
        Content={<ContentPopover imageUrl="panoramico-delantero.webp" />}
      />
      <PopoverDemo
        Trigger="Panoramico trasero"
        Content={<ContentPopover imageUrl="panoramico-trasero.webp" />}
      />
      <PopoverDemo
        Trigger="Puerta delantera"
        Content={<ContentPopover imageUrl="puerta-delantera.webp" />}
      />
      <PopoverDemo
        Trigger="Puerta trasera"
        Content={<ContentPopover imageUrl="puerta-trasera.webp" />}
      />
      <PopoverDemo
        Trigger="Luneta"
        Content={<ContentPopover imageUrl="luneta.webp" />}
      />
      <PopoverDemo
        Trigger="Fijo"
        Content={<ContentPopover imageUrl="fijo.webp" />}
      />
      <PopoverDemo
        Trigger="Custodia"
        Content={
            <ContentPopover imageUrl="custodia.webp" />
        }
      />
      <Image
        src={"/global/referencia.webp"}
        alt="imagen-de-referencia"
        width={400}
        height={400}
      />
    </div>
  );
};

export default MainPopover;
