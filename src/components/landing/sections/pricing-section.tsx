import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LandingMessages } from "@/i18n/types";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PricingSection({ m }: { m: LandingMessages }): React.ReactElement {
   const p = m.pricing;
   return (
      <section id="precios" className="relative z-10 scroll-mt-24 py-20 sm:py-28" aria-labelledby="pricing-heading">
         <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
               <Badge className="rounded-full border-0 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-950 hover:bg-amber-100 sm:text-xs dark:border dark:border-[#facc15]/45 dark:bg-[#facc15]/12 dark:text-[#facc15] dark:hover:bg-[#facc15]/18">
                  {p.kicker}
               </Badge>
               <h2
                  id="pricing-heading"
                  className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-zinc-950 dark:text-white sm:text-4xl lg:text-[2.5rem]"
               >
                  {p.heading}
               </h2>
               <p className="mt-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-400 sm:text-lg">
                  {p.subBefore}{" "}
                  <Link
                     href={siteUrl}
                     className="font-medium text-amber-800 underline decoration-amber-700/45 underline-offset-4 transition hover:text-amber-950 hover:decoration-amber-800/60 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047] dark:hover:decoration-[#fde047]/60"
                  >
                     tramixpress.me
                  </Link>
                  {p.subAfter}
               </p>
            </div>

            <ul className="mt-14 grid gap-5 sm:gap-6 lg:mt-16 lg:grid-cols-3 lg:items-stretch">
               {p.plans.map((plan) => (
                  <li
                     key={plan.name}
                     className={cn("flex min-h-0 flex-col", plan.highlight && "z-[1] overflow-visible")}
                  >
                     <Card
                        className={cn(
                           "flex w-full flex-1 flex-col gap-0 rounded-2xl border-0 bg-white/70 py-0 text-zinc-800 shadow-md shadow-zinc-900/6 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/35 dark:text-zinc-100 dark:shadow-none",
                           plan.highlight
                              ? "relative !overflow-visible border-0 bg-white/85 dark:bg-zinc-900/55 shadow-[0_0_56px_-8px_rgba(250,204,21,0.35)] lg:-my-1"
                              : "relative overflow-hidden",
                        )}
                     >
                        {plan.highlight ? (
                           <div
                              className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
                              aria-hidden
                           >
                              <BorderBeam
                                 borderWidth={3}
                                 className="from-transparent via-[#fde047] to-transparent"
                                 colorFrom="rgba(250, 204, 21, 0.2)"
                                 colorTo="#facc15"
                                 duration={5.5}
                                 size={340}
                              />
                              <BorderBeam
                                 borderWidth={2}
                                 className="from-transparent via-[#ca8a04] to-transparent"
                                 colorFrom="rgba(234, 179, 8, 0.15)"
                                 colorTo="#eab308"
                                 delay={2.75}
                                 duration={5.5}
                                 reverse
                                 size={300}
                              />
                           </div>
                        ) : null}
                        {plan.highlight ? (
                           <Badge className="absolute left-1/2 top-0 z-[35] -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-[#facc15] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-950 shadow-[0_4px_14px_rgba(0,0,0,0.35)] transition-colors duration-150 hover:bg-[#fde047] dark:border dark:border-[#facc15]/60 dark:hover:bg-[#eab308]">
                              {p.popular}
                           </Badge>
                        ) : null}
                        <CardHeader className={cn("space-y-1 px-6 pb-4 pt-8", plan.highlight && "relative z-10 pt-10")}>
                           <CardTitle className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
                              {plan.name}
                           </CardTitle>
                           <CardDescription className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
                              {plan.blurb}
                           </CardDescription>
                           <div className="border-b-0 pb-1 pt-5 dark:border-b dark:border-white/10">
                              <p className="text-4xl font-bold tabular-nums tracking-tight text-zinc-950 dark:text-white">
                                 {plan.price}
                                 <span className="text-lg font-semibold text-zinc-700 dark:text-zinc-500">
                                    {plan.suffix}
                                 </span>
                              </p>
                           </div>
                        </CardHeader>
                        <CardContent
                           className={cn("flex flex-1 flex-col px-6 pb-8 pt-2", plan.highlight && "relative z-10")}
                        >
                           <ul className="flex-1 space-y-3 text-sm leading-snug text-zinc-700 dark:text-zinc-300">
                              {plan.features.map((f) => (
                                 <li key={f} className="flex gap-3">
                                    <CheckCircle2
                                       className="mt-0.5 size-[18px] shrink-0 text-amber-600 dark:text-[#facc15]"
                                       aria-hidden
                                       strokeWidth={2}
                                    />
                                    <span>{f}</span>
                                 </li>
                              ))}
                           </ul>
                           <Button
                              className={cn(
                                 "mt-8 h-11 w-full rounded-full border-transparent font-semibold",
                                 plan.highlight
                                    ? "bg-[#facc15] text-zinc-950 transition-colors duration-150 hover:bg-[#f59e0b] dark:hover:bg-[#eab308]"
                                    : "border-0 bg-zinc-100 text-zinc-950 transition-colors duration-150 hover:bg-zinc-950/[0.1] dark:border dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white/12",
                              )}
                              variant={plan.highlight ? "default" : "outline"}
                              render={<Link href={siteUrl} />}
                           >
                              {p.cta}
                           </Button>
                        </CardContent>
                     </Card>
                  </li>
               ))}
            </ul>
         </div>
      </section>
   );
}
