import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { LandingMessages } from "@/i18n/types";

/** Not currently composed in `LandingSections`; kept for reuse or future layout. */
export function GlobalReach({ m }: { m: LandingMessages }): React.ReactElement {
   const g = m.global;
   return (
      <section className="py-16 sm:py-20">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-white via-zinc-50 to-zinc-200 py-0 text-zinc-950 shadow-lg shadow-zinc-900/8 ring-0 dark:border-0 dark:from-zinc-900 dark:via-zinc-950 dark:to-black dark:text-white dark:shadow-none dark:ring-1 dark:ring-white/10">
               <CardContent className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
                  <div className="relative z-10 max-w-lg space-y-4">
                     <div className="inline-flex items-center gap-2 text-amber-800 dark:text-[#FFB800]">
                        <Globe2 className="size-5" aria-hidden />
                        <span className="text-sm font-semibold uppercase tracking-wider">{g.kicker}</span>
                     </div>
                     <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{g.heading}</h2>
                     <p className="text-zinc-700 dark:text-zinc-400">{g.body}</p>
                     <Link
                        href="#testimonios"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline dark:text-[#FFB800]"
                     >
                        {g.link}
                        <ArrowRight className="size-4" aria-hidden />
                     </Link>
                  </div>
                  <div className="relative flex min-h-[220px] items-center justify-center lg:min-h-[280px]">
                     <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(34,197,94,0.25),transparent_55%)]"
                        aria-hidden
                     />
                     <svg viewBox="0 0 400 220" className="relative z-10 w-full max-w-md opacity-90" aria-hidden>
                        <path
                           d="M60 120 Q 200 40 340 100"
                           fill="none"
                           stroke="rgba(255,184,0,0.5)"
                           strokeWidth="2"
                           strokeDasharray="4 4"
                        />
                        <circle cx="60" cy="120" r="10" fill="#60a5fa" opacity="0.9" />
                        <text
                           x="60"
                           y="145"
                           textAnchor="middle"
                           className="fill-zinc-600 text-[10px] dark:fill-zinc-400"
                        >
                           {g.mapUsa}
                        </text>
                        <circle cx="340" cy="100" r="12" fill="#22c55e" opacity="0.95" />
                        <text
                           x="340"
                           y="130"
                           textAnchor="middle"
                           className="fill-zinc-600 text-[10px] dark:fill-zinc-400"
                        >
                           {g.mapCuba}
                        </text>
                        <path
                           d="M200 80 L 320 95 L 200 110 Z"
                           fill="rgba(255,184,0,0.12)"
                           stroke="rgba(255,184,0,0.4)"
                           strokeWidth="1"
                        />
                     </svg>
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}
