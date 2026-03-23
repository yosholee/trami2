import { ArrowRight, Facebook, Search } from "lucide-react";

import type { LandingMessages } from "@/i18n/types";
import { socialFacebookUrl, socialGoogleUrl } from "@/lib/site";

export function SocialSection({ m }: { m: LandingMessages }): React.ReactElement {
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
