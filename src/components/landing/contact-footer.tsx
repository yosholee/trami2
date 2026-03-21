import Link from "next/link";
import { Package } from "lucide-react";

import type { LandingMessages } from "@/i18n/types";
import { siteUrl } from "@/lib/site";

export function ContactFooter({ m }: { m: LandingMessages }): React.ReactElement {
   const f = m.footer;
   const mapsQuery = encodeURIComponent(f.address);
   const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
   const phoneDigits = f.phone.replace(/\D/g, "");
   const telHref =
      phoneDigits.length === 10 ? `tel:+1${phoneDigits}` : phoneDigits ? `tel:+${phoneDigits}` : "";
   return (
      <footer
         id="contacto"
         className="scroll-mt-20 border-t-0 bg-zinc-50 py-14 text-zinc-700 shadow-[0_-1px_0_0_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-t dark:border-white/10 dark:bg-[#1a1a1a] dark:text-zinc-300 dark:shadow-[0_-1px_0_0_rgba(255,255,255,0.06)]"
      >
         <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
            <div className="max-w-md space-y-4">
               <div className="flex items-center gap-2 text-lg font-semibold text-zinc-950 dark:text-white">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#FFB800] text-zinc-950">
                     <Package className="size-5" aria-hidden />
                  </span>
                  TramiXpress
               </div>
               <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{f.blurb}</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:gap-16">
               <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-500">
                     {f.contact}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                     <li>
                        <Link
                           href={siteUrl}
                           className="font-medium text-zinc-950 hover:text-amber-800 dark:text-white dark:hover:text-[#FFB800]"
                        >
                           {f.siteLink}
                        </Link>
                     </li>
                     <li>
                        <a
                           href={`mailto:${f.email}`}
                           className="text-zinc-700 hover:text-amber-800 dark:text-zinc-400 dark:hover:text-[#FFB800]"
                        >
                           {f.email}
                        </a>
                     </li>
                     <li>
                        <a
                           href={telHref || undefined}
                           className="text-zinc-700 hover:text-amber-800 dark:text-zinc-400 dark:hover:text-[#FFB800]"
                        >
                           {f.phone}
                        </a>
                     </li>
                     <li className="max-w-xs pt-0.5 leading-snug">
                        <a
                           href={mapsHref}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-zinc-700 hover:text-amber-800 dark:text-zinc-400 dark:hover:text-[#FFB800]"
                        >
                           {f.address}
                        </a>
                     </li>
                  </ul>
               </div>
               <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-500">
                     {f.hubs}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-400">
                     <li>{f.hub1}</li>
                     <li>{f.hub2}</li>
                     <li>{f.hub3}</li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="mx-auto mt-12 max-w-7xl border-t-0 px-4 pt-8 text-center text-xs text-zinc-700 dark:border-t dark:border-white/10 dark:text-zinc-500 sm:px-6 lg:px-8">
            <p>
               © {new Date().getFullYear()} TramiXpress. {f.rights}
            </p>
            <p className="mt-2 text-zinc-600 dark:text-zinc-500">{f.madeBy}</p>
         </div>
      </footer>
   );
}
