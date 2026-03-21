import { useId, type ReactElement, type SVGProps } from "react";

import { cn } from "@/lib/utils";

export interface GridPatternProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
   width?: number;
   height?: number;
   x?: number;
   y?: number;
   /** Grid cell indices `[col, row]` to fill with `currentColor`. */
   squares?: [number, number][];
   strokeDasharray?: string;
   className?: string;
}

/**
 * SVG grid background — same idea as [Magic UI Grid Pattern](https://magicui.design/docs/components/grid-pattern).
 */
export function GridPattern({
   width = 40,
   height = 40,
   x = -1,
   y = -1,
   strokeDasharray = "0",
   squares,
   className,
   ...props
}: GridPatternProps): ReactElement {
   const id = useId();
   const patternId = `${id.replace(/:/g, "")}-grid`;

   return (
      <svg
         aria-hidden
         className={cn("pointer-events-none absolute inset-0 size-full text-foreground", className)}
         {...props}
      >
         <defs>
            <pattern
               id={patternId}
               width={width}
               height={height}
               patternUnits="userSpaceOnUse"
               x={x}
               y={y}
            >
               <path
                  d={`M ${width} 0 L 0 0 0 ${height}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray={strokeDasharray}
               />
            </pattern>
         </defs>
         <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
         {squares?.map(([sx, sy], i) => (
            <rect
               key={`${sx}-${sy}-${i}`}
               strokeWidth={0}
               width={width - 1}
               height={height - 1}
               x={sx * width + x}
               y={sy * height + y}
               fill="currentColor"
               className="opacity-25"
            />
         ))}
      </svg>
   );
}
