import { MapPin, MessageCircle, PackageCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LandingMessages } from "@/i18n/types";
import { whatsappChatUrl } from "@/lib/site";

export function LocalAreasSection({ m }: { m: LandingMessages }): React.ReactElement {
   const l = m.localAreas;

   return (
      <section className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="local-areas-heading">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
               <p className="text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-[#FFB800]">
                  {l.kicker}
               </p>
               <h2
                  id="local-areas-heading"
                  className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl"
               >
                  {l.heading}
               </h2>
               <p className="mt-4 text-zinc-700 dark:text-zinc-400">{l.sub}</p>
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-3">
               {l.items.map((item) => (
                  <li key={item.city}>
                     <Card className="h-full rounded-2xl border-0 bg-white/85 shadow-md shadow-zinc-900/6 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-none">
                        <CardHeader className="space-y-4">
                           <div className="flex items-center justify-between gap-3">
                              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-[#facc15]/12 dark:text-[#facc15]">
                                 <MapPin className="size-5" aria-hidden />
                              </span>
                              <PackageCheck className="size-5 text-zinc-400 dark:text-zinc-500" aria-hidden />
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-amber-800 dark:text-[#FFB800]">{item.city}</p>
                              <CardTitle className="mt-1 text-xl text-zinc-950 dark:text-white">{item.title}</CardTitle>
                           </div>
                        </CardHeader>
                        <CardContent className="flex h-full flex-col gap-5 pt-0">
                           <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{item.body}</p>
                           <a
                              href={whatsappChatUrl(item.cta)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline dark:text-[#FFB800]"
                           >
                              <MessageCircle className="size-4" aria-hidden />
                              {item.cta}
                           </a>
                        </CardContent>
                     </Card>
                  </li>
               ))}
            </ul>
         </div>
      </section>
   );
}
