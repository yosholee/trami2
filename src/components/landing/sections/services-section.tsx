import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LandingMessages } from "@/i18n/types";
import { siteUrl } from "@/lib/site";

export function ServicesSection({ m }: { m: LandingMessages }): React.ReactElement {
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
