import Link from "next/link";

import { HeroDeliveryFigure } from "@/components/landing/hero-delivery-figure";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ripple } from "@/components/ui/ripple";
import type { Locale } from "@/i18n/config";
import type { LandingMessages } from "@/i18n/types";
import { whatsappChatUrl } from "@/lib/site";

function HeroArrowTopRight(): React.ReactElement {
   return (
      <svg
         className="absolute -left-8 top-1/2 h-14 w-20 -translate-y-1/2 text-amber-600 opacity-95 dark:text-[#facc15] sm:h-16 sm:w-24"
         viewBox="0 0 96 64"
         fill="none"
         aria-hidden
      >
         <path
            d="M4 52 C 28 8, 52 4, 88 20"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M72 12 L 88 20 L 82 36"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
}

function HeroArrowBottomRight(): React.ReactElement {
   return (
      <svg
         className="absolute -left-10 bottom-1/3 h-16 w-24 text-amber-600 opacity-95 dark:text-[#facc15] sm:-left-12 sm:h-[4.5rem] sm:w-28"
         viewBox="0 0 110 72"
         fill="none"
         aria-hidden
      >
         <path d="M8 8 C 36 4, 70 28, 96 56" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
         <path
            d="M84 44 L 96 56 L 88 68"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
}

function HeroArrowBottomLeft(): React.ReactElement {
   return (
      <svg
         className="absolute -right-8 bottom-1/3 h-16 w-24 text-amber-600 opacity-95 dark:text-[#facc15] sm:-right-10 sm:h-[4.5rem] sm:w-28"
         viewBox="0 0 110 72"
         fill="none"
         aria-hidden
      >
         <path d="M102 12 C 72 8, 40 32, 12 58" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
         <path
            d="M28 46 L 12 58 L 22 68"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
}

export function HeroSection({ m, locale }: { m: LandingMessages; locale: Locale }): React.ReactElement {
   const h = m.hero;
   return (
      <section id="inicio" className="relative z-10 scroll-mt-20 pb-16 pt-8 sm:pb-24 sm:pt-12">
         <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid min-w-0 items-start gap-10 lg:grid-cols-12 lg:gap-8">
               <div className="z-20 text-center lg:col-span-4 lg:pt-6 lg:text-left xl:col-span-4">
                  <Badge className="rounded-full border-0 bg-amber-50 px-3 py-1 text-amber-950 dark:border dark:border-[#facc15]/45 dark:bg-[#facc15]/12 dark:text-[#facc15] dark:hover:bg-[#facc15]/18">
                     {h.badge}
                  </Badge>
                  <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-zinc-950 dark:text-white sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
                     {h.h1Lead}
                     <span className="text-amber-700 dark:text-[#facc15] dark:drop-shadow-[0_0_28px_rgba(250,204,21,0.4)]">
                        {h.h1Accent}
                     </span>
                  </h1>
                  <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-zinc-700 dark:text-zinc-400 lg:mx-0 lg:text-lg">
                     {h.sub}
                  </p>
                  <div className="mt-8 flex flex-col items-center gap-2 sm:gap-3 lg:flex-row lg:flex-nowrap lg:justify-start">
                     <Button
                        className="h-11 w-full min-w-0 whitespace-nowrap rounded-full bg-[#eab308] px-4 text-sm font-semibold text-zinc-950 hover:bg-[#ca8a04] sm:w-auto sm:px-6 sm:text-base lg:shrink-0 dark:bg-[#facc15] dark:text-[#1a1a1a] dark:hover:bg-[#eab308]"
                        render={
                           <a
                              href={whatsappChatUrl()}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={h.ctaWhatsappAria}
                           />
                        }
                     >
                        {h.ctaAccount}
                     </Button>
                     <Button
                        variant="outline"
                        className="h-11 w-full min-w-0 whitespace-nowrap rounded-full border-0 bg-zinc-100/90 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-200/80 sm:w-auto sm:px-6 sm:text-base lg:shrink-0 dark:border dark:border-white/25 dark:bg-transparent dark:font-normal dark:text-white dark:hover:bg-white/10"
                        render={<Link href={`/${locale}/tracking`} />}
                     >
                        {h.ctaServices}
                     </Button>
                  </div>
               </div>

               <div className="relative z-10 mx-auto min-w-0 w-full max-w-xl lg:col-span-8 lg:max-w-none xl:col-span-8">
                  <div className="relative mx-auto flex min-h-[min(72vh,560px)] w-full min-w-0 max-w-[440px] items-center justify-center sm:max-w-[520px] lg:mx-0 lg:ml-auto lg:max-w-[min(100%,700px)] xl:max-w-[min(100%,760px)]">
                     <div
                        className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[min(100dvw,72rem)] max-w-[100dvw] -translate-x-1/2 -translate-y-1/2"
                        aria-hidden
                     >
                        <Ripple mainCircleSize={140} mainCircleOpacity={0.38} numCircles={14} ringStep={105} />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.2)_0%,transparent_58%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.08)_0%,transparent_58%)]" />
                     </div>

                     <HeroDeliveryFigure className="hero-float-slow relative z-10 py-4" title={h.imageAlt} />

                     <div className="pointer-events-none absolute right-0 top-[6%] z-20 hidden max-w-[200px] md:block lg:max-w-[220px] xl:max-w-[240px]">
                        <div className="relative pl-10 text-right">
                           <HeroArrowTopRight />
                           <p className="text-xs font-medium leading-snug text-zinc-800 dark:text-zinc-200 lg:text-sm">
                              {h.calloutTopBefore}{" "}
                              <span className="font-semibold text-amber-800 dark:text-[#facc15]">
                                 {h.calloutTopPacked}
                              </span>
                              {h.calloutTopMiddle}
                              <span className="font-semibold text-amber-800 dark:text-[#facc15]">
                                 {h.calloutTopShipped}
                              </span>
                           </p>
                        </div>
                     </div>

                     <div className="pointer-events-none absolute bottom-[12%] right-0 z-20 hidden max-w-[190px] md:block lg:max-w-[210px]">
                        <div className="relative pl-12 text-right">
                           <HeroArrowBottomRight />
                           <p className="text-xs font-medium leading-snug text-zinc-800 dark:text-zinc-200 lg:text-sm">
                              <span className="font-semibold text-amber-800 dark:text-[#facc15]">
                                 {h.calloutQuickly}
                              </span>
                              {h.calloutHitchMid}
                              <span className="font-semibold text-amber-800 dark:text-[#facc15]">{h.calloutHitch}</span>
                           </p>
                        </div>
                     </div>

                     <div className="pointer-events-none absolute bottom-[18%] left-0 z-20 hidden max-w-[200px] md:block lg:max-w-[230px]">
                        <div className="relative pr-10 text-left">
                           <HeroArrowBottomLeft />
                           <p className="text-xs font-medium leading-snug text-zinc-800 dark:text-zinc-200 lg:text-sm">
                              {h.calloutPrior}{" "}
                              <span className="font-semibold text-amber-800 dark:text-[#facc15]">
                                 {h.calloutConvenience}
                              </span>
                           </p>
                        </div>
                     </div>
                  </div>

                  <p className="mt-6 text-center text-xs text-zinc-700 dark:text-zinc-500 md:hidden">
                     {h.mobileTagline}
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}
