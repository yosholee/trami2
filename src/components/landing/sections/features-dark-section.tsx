import Link from "next/link";

import { FeaturesCrmBentoGrid } from "@/components/landing/sections/features-crm-bento-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GridPattern } from "@/components/ui/grid-pattern";
import type { LandingMessages } from "@/i18n/types";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const CARD_GRID_PATTERN_SQUARES: [number, number][] = [
   [2, 2],
   [4, 1],
   [6, 3],
   [3, 5],
   [7, 4],
   [5, 6],
   [1, 7],
   [8, 2],
   [10, 5],
   [12, 1],
];

export function FeaturesDark({ m }: { m: LandingMessages }): React.ReactElement {
   const f = m.features;
   return (
      <section className="py-16 sm:py-20">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden rounded-3xl border-0 bg-white/95 py-0 text-zinc-900 shadow-lg shadow-zinc-900/8 dark:border-0 dark:bg-zinc-950/10 dark:text-zinc-100 dark:shadow-none dark:ring-1 dark:ring-white/10">
               <GridPattern
                  width={32}
                  height={32}
                  squares={CARD_GRID_PATTERN_SQUARES}
                  className={cn(
                     "text-zinc-900/15 dark:text-white/7",
                     "mask-[radial-gradient(ellipse_120%_90%_at_50%_25%,white_18%,transparent_68%)]",
                  )}
               />
               <CardContent className="relative z-10 grid gap-10 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
                  <FeaturesCrmBentoGrid
                     labels={{
                        ordersAlt: f.crmBentoOrdersAlt,
                        dashboardAlt: f.crmBentoDashboardAlt,
                        logisticsAlt: f.crmBentoLogisticsAlt,
                     }}
                  />
                  <div className="space-y-6">
                     <Badge className="rounded-full bg-[#FFB800] px-3 py-1 text-zinc-950 hover:bg-[#FFB800]">
                        {f.badge}
                     </Badge>
                     <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                        {f.heading}
                     </h2>
                     <p className="text-zinc-700 dark:text-zinc-400">{f.body}</p>
                     <div className="flex flex-wrap gap-3">
                        <Button
                           className="h-11 rounded-full bg-[#FFB800] px-6 text-zinc-950 transition-colors duration-150 hover:bg-[#e6ac00] dark:hover:bg-[#e5a800]"
                           render={<Link href={siteUrl} />}
                        >
                           {f.learnMore}
                        </Button>
                        <Button
                           variant="outline"
                           className="h-11 rounded-full border-0 bg-zinc-100 px-6 text-zinc-800 transition-colors duration-150 hover:bg-zinc-950/[0.08] dark:border dark:border-white/30 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
                           render={<Link href={siteUrl} />}
                        >
                           {f.tryNow}
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}
