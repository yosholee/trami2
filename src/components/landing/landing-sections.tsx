import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Facebook, Globe2, Search, ShieldCheck, Star, Truck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Highlighter } from "@/components/ui/highlighter";
import { ContactFooter } from "@/components/landing/contact-footer";
import { HeroDeliveryFigure } from "@/components/landing/hero-delivery-figure";
import { LocationTrackingMap } from "@/components/landing/location-tracking-map";
import { ValueProposition } from "@/components/landing/value-proposition";
import { Ripple } from "@/components/ui/ripple";
import type { Locale } from "@/i18n/config";
import type { LandingMessages } from "@/i18n/types";
import { siteUrl, socialFacebookUrl, socialGoogleUrl, whatsappChatUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

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

function HeroSection({ m, locale }: { m: LandingMessages; locale: Locale }): React.ReactElement {
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

function TrustStats({ m }: { m: LandingMessages }): React.ReactElement {
   const t = m.trust;
   const items = [
      { title: t.fastTitle, detail: t.fastDetail },
      { title: t.secureTitle, detail: t.secureDetail },
      { title: t.supportTitle, detail: t.supportDetail },
   ] as const;

   return (
      <section className="border-y-0 py-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_-1px_0_0_rgba(0,0,0,0.05)] dark:border-y dark:border-white/10 dark:shadow-none sm:py-12">
         <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">
               {t.heading}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
               {items.map((item) => (
                  <div
                     key={item.title}
                     className="rounded-2xl border-0 bg-white/80 p-6 text-center shadow-md shadow-zinc-900/6 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-none sm:text-left"
                  >
                     <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{item.title}</h3>
                     <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{item.detail}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}

function ServicesSection({ m }: { m: LandingMessages }): React.ReactElement {
   const s = m.services;
   return (
      <section id="opciones-envio" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="services-heading">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-[#FFB800]">
               {s.kicker}
            </p>
            <h2
               id="services-heading"
               className="mx-auto mt-2 max-w-2xl text-center text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl"
            >
               {s.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-700 dark:text-zinc-400">{s.sub}</p>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
               {s.items.map((item) => (
                  <li key={item.title}>
                     <Card className="h-full rounded-2xl border-0 bg-white/80 shadow-md shadow-zinc-900/6 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-none">
                        <CardHeader>
                           <CardTitle className="text-lg text-zinc-800 dark:text-zinc-100">{item.title}</CardTitle>
                           <CardDescription className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">
                              {item.body}
                           </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                           <Link
                              href={siteUrl}
                              className="text-sm font-semibold text-amber-800 hover:underline dark:text-[#FFB800]"
                           >
                              {s.learnMore}
                           </Link>
                        </CardContent>
                     </Card>
                  </li>
               ))}
            </ul>
            <div className="mt-10 flex justify-center">
               <Button
                  className="h-11 rounded-full bg-zinc-900 px-8 text-white hover:bg-zinc-800 dark:bg-zinc-950"
                  render={<Link href={siteUrl} />}
               >
                  {s.cta}
               </Button>
            </div>
         </div>
      </section>
   );
}

function PricingSection({ m }: { m: LandingMessages }): React.ReactElement {
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
                           <Badge className="absolute left-1/2 top-0 z-[35] -translate-x-1/2 -translate-y-1/2 rounded-full border-0 bg-[#facc15] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-950 shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:bg-[#eab308] dark:border dark:border-[#facc15]/60">
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
                                    ? "bg-[#facc15] text-zinc-950 hover:bg-[#eab308]"
                                    : "border-0 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 dark:border dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white/12",
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

function FaqSection({ m }: { m: LandingMessages }): React.ReactElement {
   const f = m.faq;
   return (
      <section id="faq" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="faq-heading">
         <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-[#FFB800]">
               {f.kicker}
            </p>
            <h2
               id="faq-heading"
               className="mt-2 text-center text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl"
            >
               {f.heading}
            </h2>
            <p className="mt-4 text-center text-zinc-700 dark:text-zinc-400">{f.sub}</p>
            <div className="mt-10 space-y-3">
               {f.items.map((item) => (
                  <details
                     key={item.q}
                     className="group rounded-2xl border-0 bg-white px-4 py-1 shadow-sm shadow-zinc-900/5 open:bg-zinc-50 open:shadow-md dark:border dark:border-white/10 dark:bg-zinc-900/50 dark:shadow-none dark:open:bg-zinc-900/75"
                  >
                     <summary className="cursor-pointer list-none py-4 font-semibold text-zinc-800 dark:text-zinc-100 marker:content-none [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center justify-between gap-4">
                           {item.q}
                           <span className="text-amber-800 transition group-open:rotate-45 dark:text-[#FFB800]">+</span>
                        </span>
                     </summary>
                     <p className="border-t-0 pb-4 pt-2 text-sm leading-relaxed text-zinc-700 dark:border-t dark:border-white/10 dark:text-zinc-400">
                        {item.a}
                     </p>
                  </details>
               ))}
            </div>
            <p className="mt-10 text-center text-sm text-zinc-700 dark:text-zinc-400">
               {f.moreHelp}{" "}
               <Link
                  href={siteUrl}
                  className="font-semibold text-zinc-950 underline hover:text-amber-800 dark:text-white dark:hover:text-[#FFB800]"
               >
                  {f.supportLink}
               </Link>
            </p>
         </div>
      </section>
   );
}

interface FeaturesCrmBentoLabels {
   ordersAlt: string;
   dashboardAlt: string;
   logisticsAlt: string;
}

function BentoCrmTile({
   src,
   alt,
   className,
   sizes,
}: {
   src: string;
   alt: string;
   className?: string;
   sizes: string;
}): React.ReactElement {
   return (
      <div
         className={cn(
            "relative min-h-[200px] overflow-hidden rounded-xl border-0 bg-zinc-50/95 shadow-md shadow-zinc-900/8 sm:min-h-[220px] lg:min-h-0 dark:border dark:border-white/8 dark:bg-zinc-900/60 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
            className,
         )}
      >
         <Image src={src} alt={alt} fill className="object-cover object-top-left" sizes={sizes} />
      </div>
   );
}

function FeaturesCrmBentoGrid({ labels }: { labels: FeaturesCrmBentoLabels }): React.ReactElement {
   return (
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border-0 bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.14)] ring-0 dark:border dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] dark:ring-1 dark:ring-black/50 lg:max-w-none">
         <div className="flex items-center gap-2 border-b-0 bg-zinc-100 px-3 py-2 dark:border-b dark:border-white/10 dark:bg-black/40 sm:px-4 sm:py-2.5">
            <span className="size-2 rounded-full bg-red-500/85 sm:size-2.5" aria-hidden />
            <span className="size-2 rounded-full bg-yellow-500/85 sm:size-2.5" aria-hidden />
            <span className="size-2 rounded-full bg-green-500/85 sm:size-2.5" aria-hidden />
            <span className="ml-1.5 font-mono text-[10px] tracking-tight text-zinc-700 dark:text-zinc-500 sm:text-[11px]">
               app.tramixpress.me
            </span>
         </div>
         <div className="grid grid-cols-1 gap-2 p-2 sm:gap-2.5 sm:p-2.5 lg:grid-cols-12 lg:grid-rows-2 lg:gap-3 lg:p-3">
            <BentoCrmTile
               src="/landing/crm-orders.png"
               alt={labels.ordersAlt}
               sizes="(max-width: 1024px) 100vw, 340px"
               className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-[420px]"
            />
            <BentoCrmTile
               src="/landing/crm-dashboard.png"
               alt={labels.dashboardAlt}
               sizes="(max-width: 1024px) 100vw, 520px"
               className="aspect-16/11 lg:col-span-7 lg:col-start-6 lg:row-span-1 lg:row-start-1 lg:aspect-auto lg:min-h-[200px]"
            />
            <BentoCrmTile
               src="/landing/crm-logistics.png"
               alt={labels.logisticsAlt}
               sizes="(max-width: 1024px) 100vw, 520px"
               className="aspect-16/10 lg:col-span-7 lg:col-start-6 lg:row-span-1 lg:row-start-2 lg:aspect-auto lg:min-h-[200px]"
            />
         </div>
      </div>
   );
}

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

function FeaturesDark({ m }: { m: LandingMessages }): React.ReactElement {
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
                           className="h-11 rounded-full bg-[#FFB800] px-6 text-zinc-950 hover:bg-[#e5a800]"
                           render={<Link href={siteUrl} />}
                        >
                           {f.learnMore}
                        </Button>
                        <Button
                           variant="outline"
                           className="h-11 rounded-full border-0 bg-zinc-100 px-6 text-zinc-800 hover:bg-zinc-200/80 dark:border dark:border-white/30 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
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

function LocationSection({ m }: { m: LandingMessages }): React.ReactElement {
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
                           className="h-11 rounded-full bg-[#FFB800] px-6 text-zinc-950 hover:bg-[#e5a800]"
                           render={<Link href={siteUrl} />}
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
                              miamiHub: l.mapMiamiHub,
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

function HowItWorks({ m }: { m: LandingMessages }): React.ReactElement {
   const h = m.how;
   const icons = [Truck, CheckCircle2, ShieldCheck] as const;
   const items = h.items.map((item, i) => ({
      icon: icons[i],
      title: item.title,
      text: item.text,
   }));

   return (
      <section className="py-16 sm:py-24">
         <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div className="relative flex justify-center">
               <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#FFB800]/20 to-transparent blur-3xl" />
               <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
                  alt={h.imageAlt}
                  width={520}
                  height={600}
                  className="max-h-[min(520px,70vh)] w-full max-w-md rounded-3xl object-cover shadow-xl ring-0 dark:ring-1 dark:ring-white/10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
               />
            </div>
            <div className="space-y-8">
               <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  {h.heading}
               </h2>
               <ul className="space-y-6">
                  {items.map(({ icon: Icon, title, text }) => (
                     <li key={title} className="flex gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-200/90 text-amber-900 dark:bg-[#FFB800]/20 dark:text-[#FFB800]">
                           <Icon className="size-5" aria-hidden />
                        </span>
                        <div>
                           <p className="font-semibold text-zinc-800 dark:text-zinc-100">{title}</p>
                           <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{text}</p>
                        </div>
                     </li>
                  ))}
               </ul>
               <Button
                  className="h-11 rounded-full bg-zinc-900 px-6 text-white hover:bg-zinc-800 dark:bg-zinc-950"
                  render={<Link href={siteUrl} />}
               >
                  {h.cta}
               </Button>
            </div>
         </div>
      </section>
   );
}

function GlobalReach({ m }: { m: LandingMessages }): React.ReactElement {
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

const TESTIMONIAL_IMAGES = [
   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
] as const;

function Testimonials({ m }: { m: LandingMessages }): React.ReactElement {
   const t = m.testimonials;
   return (
      <section id="testimonios" className="scroll-mt-24 py-16 sm:py-24">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
               <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  {t.heading}
               </h2>
               <p className="mt-4 text-zinc-700 dark:text-zinc-400">{t.sub}</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
               {t.items.map((item, index) => (
                  <Card
                     key={item.name}
                     className="rounded-2xl border-0 bg-white/80 shadow-md shadow-zinc-900/6 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-none"
                  >
                     <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <Avatar size="lg" className="size-12">
                           <AvatarImage src={TESTIMONIAL_IMAGES[index]} alt={`${item.name}, ${item.role}`} />
                           <AvatarFallback className="bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                              {item.initials}
                           </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                           <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">{item.name}</CardTitle>
                           <CardDescription className="text-zinc-700 dark:text-zinc-400">{item.role}</CardDescription>
                           <div
                              className="mt-2 flex gap-0.5 text-amber-600 dark:text-[#FFB800]"
                              aria-label={t.starsLabel}
                           >
                              {Array.from({ length: 5 }).map((_, i) => (
                                 <Star key={i} className="size-4 fill-current" aria-hidden />
                              ))}
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                           &ldquo;{item.quote}&rdquo;
                        </p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </section>
   );
}

/** Shared dot pattern behind social + final CTA so both read as one band. */
function SocialFinalCtaBand({ m }: { m: LandingMessages }): React.ReactElement {
   return (
      <div className="relative overflow-hidden">
         <div className="pointer-events-none absolute inset-0" aria-hidden>
            <DotPattern
               className={cn(
                  "text-zinc-900/8 dark:text-white/7",
                  "mask-[radial-gradient(ellipse_90%_85%_at_50%_45%,white_18%,transparent_72%)]",
               )}
               cr={1}
               cx={1}
               cy={1}
               height={22}
               width={22}
            />
         </div>
         <div className="relative z-10">
            <SocialSection m={m} />
            <LocationSection m={m} />
            <FinalCta m={m} />
         </div>
      </div>
   );
}

function SocialSection({ m }: { m: LandingMessages }): React.ReactElement {
   const s = m.social;
   const linkClass =
      "group flex items-center gap-4 rounded-2xl border-0 bg-white p-5 text-left shadow-md shadow-zinc-900/6 transition hover:bg-zinc-50 dark:bg-zinc-900/45 dark:shadow-none dark:hover:bg-zinc-900/65";
   const iconWrap =
      "flex size-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white";

   return (
      <section id="social" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="social-heading">
         <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-[#FFB800]">
               {s.kicker}
            </p>
            <h2
               id="social-heading"
               className="mt-2 text-center text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl"
            >
               {s.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-zinc-700 dark:text-zinc-400">
               {s.sub}
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
               <li>
                  <a
                     href={socialFacebookUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={linkClass}
                     aria-label={`${s.facebookLabel} — ${s.opensNewTab}`}
                  >
                     <span className={iconWrap} aria-hidden>
                        <Facebook className="size-6" strokeWidth={2} />
                     </span>
                     <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-zinc-950 dark:text-white">{s.facebookLabel}</span>
                        <span className="mt-0.5 block text-xs text-zinc-600 dark:text-zinc-500">{s.opensNewTab}</span>
                     </span>
                     <ArrowRight
                        className="size-5 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-amber-700 dark:group-hover:text-[#facc15]"
                        aria-hidden
                     />
                  </a>
               </li>
               <li>
                  <a
                     href={socialGoogleUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={linkClass}
                     aria-label={`${s.googleLabel} — ${s.opensNewTab}`}
                  >
                     <span className={iconWrap} aria-hidden>
                        <Search className="size-6" strokeWidth={2} />
                     </span>
                     <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-zinc-950 dark:text-white">{s.googleLabel}</span>
                        <span className="mt-0.5 block text-xs text-zinc-600 dark:text-zinc-500">{s.opensNewTab}</span>
                     </span>
                     <ArrowRight
                        className="size-5 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-amber-700 dark:group-hover:text-[#facc15]"
                        aria-hidden
                     />
                  </a>
               </li>
            </ul>
         </div>
      </section>
   );
}

function FinalCta({ m }: { m: LandingMessages }): React.ReactElement {
   const c = m.finalCta;
   return (
      <section id="carrera" className="scroll-mt-24 py-16 sm:py-20">
         <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-white sm:text-3xl">{c.heading}</h2>
            <p className="mt-3 text-zinc-700 dark:text-zinc-400">{c.body}</p>
            <div className="mt-8 flex flex-col items-center gap-2 sm:gap-3 lg:flex-row lg:flex-nowrap lg:justify-center">
               <Button
                  className="h-11 w-full min-w-0 whitespace-nowrap rounded-full bg-[#FFB800] px-4 text-sm text-zinc-950 hover:bg-[#e5a800] sm:w-auto sm:px-8 sm:text-base lg:shrink-0"
                  render={
                     <a
                        href={whatsappChatUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={c.ctaWhatsappAria}
                     />
                  }
               >
                  {c.ctaAccount}
               </Button>
               <Button
                  variant="outline"
                  className="h-11 w-full min-w-0 whitespace-nowrap rounded-full border-0 bg-zinc-100 px-4 text-sm text-zinc-800 hover:bg-zinc-200/80 sm:w-auto sm:px-8 sm:text-base lg:shrink-0 dark:border dark:border-white/25 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
                  render={<Link href="#contacto" />}
               >
                  {c.ctaSales}
               </Button>
            </div>
            <p className="mt-6 text-sm text-zinc-700 dark:text-zinc-500">{c.newsletter}</p>
         </div>
      </section>
   );
}

export function LandingSections({
   messages: m,
   locale,
}: {
   messages: LandingMessages;
   locale: Locale;
}): React.ReactElement {
   return (
      <>
         <HeroSection m={m} locale={locale} />
         <PricingSection m={m} />
         <SocialFinalCtaBand m={m} />
         <ServicesSection m={m} />
         <FeaturesDark m={m} />
         <Testimonials m={m} />
         <FaqSection m={m} />
         <ContactFooter m={m} />
      </>
   );
}
