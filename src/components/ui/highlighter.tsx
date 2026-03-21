"use client";

import { useLayoutEffect, useRef, type ReactElement, type ReactNode } from "react";
import { useInView } from "motion/react";
import { annotate } from "rough-notation";
import type { RoughAnnotationType } from "rough-notation/lib/model";

import { cn } from "@/lib/utils";

export interface HighlighterProps {
   children: ReactNode;
   /** Maps to rough-notation `type`. */
   action?: RoughAnnotationType;
   color?: string;
   strokeWidth?: number;
   animationDuration?: number;
   iterations?: number;
   padding?: number;
   multiline?: boolean;
   isView?: boolean;
   className?: string;
}

export function Highlighter({
   children,
   action = "highlight",
   color = "#ffd1dc",
   strokeWidth = 1.5,
   animationDuration = 500,
   iterations = 2,
   padding = 2,
   multiline = true,
   isView = false,
   className,
}: HighlighterProps): ReactElement {
   const elementRef = useRef<HTMLSpanElement>(null);
   const isInView = useInView(elementRef, { once: true, margin: "-10%" });
   const shouldShow = !isView || isInView;

   useLayoutEffect(() => {
      const element = elementRef.current;
      if (!element || !shouldShow) {
         return undefined;
      }

      const annotation = annotate(element, {
         type: action,
         color,
         strokeWidth,
         animationDuration,
         iterations,
         padding,
         multiline,
      });
      annotation.show();

      const resizeObserver = new ResizeObserver(() => {
         annotation.hide();
         annotation.show();
      });
      resizeObserver.observe(element);

      return () => {
         resizeObserver.disconnect();
         annotation.remove();
      };
   }, [shouldShow, action, color, strokeWidth, animationDuration, iterations, padding, multiline]);

   return (
      <span ref={elementRef} className={cn("relative inline", className)}>
         {children}
      </span>
   );
}
