import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

export interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  /** Pixel spacing between concentric rings (default 70). */
  ringStep?: number;
}

/**
 * Animated ripple rings — pattern from Magic UI (https://magicui.design/docs/components/ripple).
 */
export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  ringStep = 70,
  className,
  ...props
}: RippleProps): React.ReactElement {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * ringStep;
        const opacity = Math.max(mainCircleOpacity - i * 0.03, 0);
        const delay = i * 0.06;

        return (
          <div
            key={i}
            className="absolute rounded-full border border-amber-500/40 bg-amber-400/[0.14] shadow-[0_0_64px_rgba(217,119,6,0.22)] dark:border-[#facc15]/30 dark:bg-[#facc15]/[0.07] dark:shadow-[0_0_48px_rgba(250,204,21,0.1)]"
            style={
              {
                width: size,
                height: size,
                opacity,
                top: "50%",
                left: "50%",
                animation: `ripple 2s ease ${delay}s infinite`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
});

Ripple.displayName = "Ripple";
