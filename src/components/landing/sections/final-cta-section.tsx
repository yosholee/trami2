import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { LandingMessages } from "@/i18n/types";
import { whatsappChatUrl } from "@/lib/site";

export function FinalCta({ m }: { m: LandingMessages }): React.ReactElement {
   const c = m.finalCta;
   return (
      <section id="carrera" className="scroll-mt-24 py-16 sm:py-20">
         <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-white sm:text-3xl">{c.heading}</h2>
            <p className="mt-3 text-zinc-700 dark:text-zinc-400">{c.body}</p>
            <div className="mt-8 flex flex-col items-center gap-2 sm:gap-3 lg:flex-row lg:flex-nowrap lg:justify-center">
               <Button
                  className="h-11 w-full min-w-0 whitespace-nowrap rounded-full bg-[#FFB800] px-4 text-sm text-zinc-950 transition-colors duration-150 hover:bg-[#e6ac00] sm:w-auto sm:px-8 sm:text-base lg:shrink-0 dark:hover:bg-[#e5a800]"
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
                  className="h-11 w-full min-w-0 whitespace-nowrap rounded-full border-0 bg-zinc-100 px-4 text-sm text-zinc-800 transition-colors duration-150 hover:bg-zinc-950/[0.08] sm:w-auto sm:px-8 sm:text-base lg:shrink-0 dark:border dark:border-white/25 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
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
