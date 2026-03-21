import type { ReactElement } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const HERO_COURIER = "/images/hero-delivery-scooter.png";

export function HeroDeliveryFigure({
  className,
  title,
}: {
  className?: string;
  title: string;
}): ReactElement {
  return (
    <Image
      src={HERO_COURIER}
      alt={title}
      width={496}
      height={503}
      priority
      sizes="(max-width: 640px) 85vw, 360px"
      className={cn(
        "relative z-10 h-auto w-full max-w-[min(88vw,360px)] object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]",
        className
      )}
    />
  );
}
