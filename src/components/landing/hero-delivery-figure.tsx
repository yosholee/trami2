import type { ReactElement } from "react";
import Image from "next/image";

const HERO_COURIER = "/images/slice2.png";

export function HeroDeliveryFigure({ title }: { className?: string; title: string }): ReactElement {
   return (
      <Image
         src={HERO_COURIER}
         alt={title}
         width={496}
         height={503}
         priority
         sizes="(max-width: 640px) 85vw, 360px"
         className="bg-transparent drop-shadow-[0_18px_36px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
      />
   );
}
