import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import Link from "next/link";

import type { LandingMessages } from "@/i18n/types";

export function FaqPageContent({
   locale,
   m,
}: {
   locale: Locale;
   m: LandingMessages["faqPage"];
}): ReactElement {
   const f = m;
   return (
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:max-w-4xl lg:px-8">
         <header className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-[#FFB800]">{f.kicker}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{f.heading}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-700 dark:text-zinc-400">{f.sub}</p>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
               <Link
                  href={`/${locale}/tracking`}
                  className="font-semibold text-amber-800 underline decoration-amber-700/45 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
               >
                  {f.ctaTracking}
               </Link>
            </p>
         </header>

         <div className="mt-14 space-y-16">
            {f.sections.map((section) => (
               <section key={section.id} id={section.id} className="scroll-mt-28" aria-labelledby={`faq-section-${section.id}`}>
                  <h2
                     id={`faq-section-${section.id}`}
                     className="border-b border-zinc-200 pb-3 text-lg font-semibold tracking-tight text-zinc-950 dark:border-white/15 dark:text-white"
                  >
                     {section.title}
                  </h2>
                  <div className="mt-6 space-y-3">
                     {section.items.map((item) => (
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
            ))}
         </div>
      </div>
   );
}
