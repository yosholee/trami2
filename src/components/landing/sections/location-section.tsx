import Link from "next/link";

import { LocationTrackingMap } from "@/components/landing/location-tracking-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Highlighter } from "@/components/ui/highlighter";
import type { Locale } from "@/i18n/config";
import type { LandingMessages } from "@/i18n/types";
import { cn } from "@/lib/utils";

export function LocationSection({ m, locale }: { m: LandingMessages; locale: Locale }): React.ReactElement {
   const l = m.location;
   return (
      <section className="relative overflow-hidden py-16 sm:py-20">
         <div
            className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-[min(100%,520px)] sm:max-w-[45%]"
            aria-hidden
         >
            <DotPattern
               className={cn(
                  "text-zinc-900/8 dark:text-white/7 mask-[linear-gradient(to_right,white_0%,white_35%,transparent_100%)]",
               )}
               cr={1}
               cx={1}
               cy={1}
               height={22}
               width={22}
            />
         </div>
         <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden rounded-3xl border-0 bg-white py-0 text-zinc-900 shadow-lg shadow-zinc-900/8 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:shadow-none">
               <CardContent className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
                  <div className="space-y-5">
                     <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                        {l.headingBefore}
                        <Highlighter
                           action="highlight"
                           animationDuration={600}
                           color="rgba(250, 204, 21, 0.42)"
                           isView
                           iterations={2}
                           strokeWidth={1.6}
                        >
                           {l.headingHighlight}
                        </Highlighter>
                        {l.headingAfter}
                     </h2>
                     <p className="text-zinc-700 dark:text-zinc-400">{l.body}</p>
                     <div className="flex flex-wrap gap-3">
                        <Button
                           className="h-11 rounded-full bg-[#FFB800] px-6 text-zinc-950 transition-colors duration-150 hover:bg-[#e6ac00] dark:hover:bg-[#e5a800]"
                           render={<Link href={`/${locale}/tracking`} />}
                        >
                           {l.track}
                        </Button>
                     </div>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border-0 bg-white/90 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04),0_4px_24px_-8px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border dark:border-white/10 dark:bg-zinc-950/10 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                     <div className="flex items-center gap-2 border-b-0 bg-zinc-100 px-4 py-2 text-xs text-zinc-700 dark:border-b dark:border-white/10 dark:bg-black/20 dark:text-zinc-500">
                        <span className="size-2 rounded-full bg-red-500/80" />
                        <span className="size-2 rounded-full bg-yellow-500/80" />
                        <span className="size-2 rounded-full bg-green-500/80" />
                        <span className="ml-2">track.tramixpress.app</span>
                     </div>
                     <div className="relative aspect-16/11 bg-white dark:bg-zinc-950">
                        <LocationTrackingMap
                           labels={{
                              originHub: l.mapOriginHub,
                              havana: l.mapHavana,
                              santiago: l.mapSantiagoDelivery,
                              shipEnRoute: l.mapShipEnRoute,
                              groundLeg: l.mapGroundLeg,
                              deliveryBadge: l.mapDeliveryBadge,
                              provinces: l.mapProvinces,
                           }}
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}
