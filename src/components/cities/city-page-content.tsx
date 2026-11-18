import type { ReactElement } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { PricingSection } from "@/components/landing/sections/pricing-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/config";
import { getCityPages } from "@/i18n/content/city-pages";
import type { CityPage, LandingMessages } from "@/i18n/types";
import { whatsappChatUrl } from "@/lib/site";

export function CityPageContent({
   locale,
   city,
   m,
}: {
   locale: Locale;
   city: CityPage;
   m: LandingMessages;
}): ReactElement {
   const others = getCityPages(locale).cities.filter((c) => c.slug !== city.slug);
   const otherCitiesLabel = getCityPages(locale).otherCitiesLabel;

   return (
      <div className="w-full">
         <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:max-w-4xl lg:px-8">
            <header className="text-center">
               <p className="text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-[#FFB800]">{city.kicker}</p>
               <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{city.heading}</h1>
            </header>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-400">
               {city.intro.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
               ))}
            </div>
            <p className="mt-8 flex flex-wrap items-center gap-4">
               <a
                  href={whatsappChatUrl(city.ctaWhatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-amber-300"
               >
                  <MessageCircle className="size-4" aria-hidden />
                  {city.ctaWhatsapp}
               </a>
               <Link
                  href={`/${locale}/tracking`}
                  className="text-sm font-semibold text-amber-800 underline decoration-amber-700/45 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
               >
                  {city.ctaTracking}
               </Link>
            </p>

            <section className="mt-16" aria-labelledby="city-steps-heading">
               <h2
                  id="city-steps-heading"
                  className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl"
               >
                  {city.stepsHeading}
               </h2>
               <ol className="mt-8 grid gap-5 md:grid-cols-3">
                  {city.steps.map((step, index) => (
                     <li key={step.title}>
                        <Card className="h-full rounded-2xl border-0 bg-white/85 shadow-md shadow-zinc-900/6 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-none">
                           <CardHeader className="space-y-3">
                              <span className="inline-flex size-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-900 dark:bg-[#facc15]/12 dark:text-[#facc15]">
                                 {index + 1}
                              </span>
                              <CardTitle className="text-lg text-zinc-950 dark:text-white">{step.title}</CardTitle>
                           </CardHeader>
                           <CardContent className="pt-0">
                              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{step.text}</p>
                           </CardContent>
                        </Card>
                     </li>
                  ))}
               </ol>
            </section>
         </div>

         <PricingSection m={m} />

         <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:max-w-4xl lg:px-8">
            <section aria-labelledby="city-faqs-heading">
               <h2
                  id="city-faqs-heading"
                  className="border-b border-zinc-200 pb-3 text-lg font-semibold tracking-tight text-zinc-950 dark:border-white/15 dark:text-white"
               >
                  {city.faqsHeading}
               </h2>
               <div className="mt-6 space-y-3">
                  {city.faqs.map((item) => (
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
                        <p className="border-t-0 pb-4 pt-2 text-sm leading-relaxed text-zinc-700 dark:border-t dark:border-white/10 dark:text-zinc-400">{item.a}</p>
                     </details>
                  ))}
               </div>
            </section>

            <nav className="mt-16 text-center text-sm text-zinc-600 dark:text-zinc-500" aria-label={otherCitiesLabel}>
               <span className="font-semibold text-zinc-800 dark:text-zinc-200">{otherCitiesLabel}: </span>
               {others.map((other, index) => (
                  <span key={other.slug}>
                     {index > 0 && <span aria-hidden> · </span>}
                     <Link
                        href={`/${locale}/envios-a-cuba/${other.slug}`}
                        className="font-semibold text-amber-800 underline decoration-amber-700/45 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
                     >
                        {other.heading}
                     </Link>
                  </span>
               ))}
            </nav>
         </div>
      </div>
   );
}
