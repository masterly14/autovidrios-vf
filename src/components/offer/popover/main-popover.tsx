import React from "react";
import { PopoverDemo } from "./popover-component";
import Image from "next/image";
import ContentPopover from "./content-popover";

const MainPopover = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <PopoverDemo
        Trigger="Panoramico delantero"
        Content={<ContentPopover imageUrl="panoramico-delantero.png" />}
      />
      <PopoverDemo
        Trigger="Panoramico trasero"
        Content={<ContentPopover imageUrl="panoramico-trasero.png" />}
      />
      <PopoverDemo
        Trigger="Puerta delantera"
        Content={<ContentPopover imageUrl="puerta-delantera.png" />}
      />
      <PopoverDemo
        Trigger="Puerta trasera"
        Content={<ContentPopover imageUrl="puerta-trasera.png" />}
      />
      <PopoverDemo
        Trigger="Luneta"
        Content={<ContentPopover imageUrl="luneta.png" />}
      />
      <PopoverDemo
        Trigger="Fijo"
        Content={<ContentPopover imageUrl="fijo.png" />}
      />
      <PopoverDemo
        Trigger="Custodia"
        Content={
            <ContentPopover imageUrl="custodia.png" />
        }
      />
      <Image
        src={"/global/referencia.png"}
        alt="imagen-de-referencia"
        width={400}
        height={400}
      />
    </div>
  );
};

export default MainPopover;
