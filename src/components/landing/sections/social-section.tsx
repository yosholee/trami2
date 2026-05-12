import { ArrowRight, Facebook } from "lucide-react";
import type { ReactElement } from "react";

import type { LandingMessages } from "@/i18n/types";
import { socialFacebookUrl, socialGoogleUrl, socialTiktokUrl } from "@/lib/site";

/** Google "G" brand mark (Marketing Resource Center colors), viewBox 0 0 24 24. */
function GoogleGlyph({ className }: { className?: string }): ReactElement {
   return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
         <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
         />
         <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
         />
         <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
         />
         <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
         />
      </svg>
   );
}

/** Bootstrap Icons `bi-tiktok` glyph (MIT), viewBox 0 0 16 16. */
function TiktokGlyph({ className }: { className?: string }): ReactElement {
   return (
      <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
         <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
      </svg>
   );
}

export function SocialSection({ m }: { m: LandingMessages }): ReactElement {
   const s = m.social;
   const linkClass =
      "group flex items-center gap-4 rounded-2xl border-0 bg-white p-5 text-left shadow-md shadow-zinc-900/6 transition-colors duration-150 hover:bg-zinc-950/[0.04] dark:bg-zinc-900/45 dark:shadow-none dark:hover:bg-zinc-900/65";
   const iconWrap =
      "flex size-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-white/10 dark:text-white";

   return (
      <section id="social" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="social-heading">
         <div className="mx-auto max-w-5xl px-4 sm:px-6">
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
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
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
                     href={socialTiktokUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={linkClass}
                     aria-label={`${s.tiktokLabel} — ${s.opensNewTab}`}
                  >
                     <span className={iconWrap} aria-hidden>
                        <TiktokGlyph className="size-6" />
                     </span>
                     <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-zinc-950 dark:text-white">{s.tiktokLabel}</span>
                        <span className="mt-0.5 block text-xs text-zinc-600 dark:text-zinc-500">{s.opensNewTab}</span>
                     </span>
                     <ArrowRight
                        className="size-5 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-amber-700 dark:group-hover:text-[#facc15]"
                        aria-hidden
                     />
                  </a>
               </li>
               <li className="sm:col-span-2 xl:col-span-1">
                  <a
                     href={socialGoogleUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className={linkClass}
                     aria-label={`${s.googleLabel} — ${s.opensNewTab}`}
                  >
                     <span className={iconWrap} aria-hidden>
                        <GoogleGlyph className="size-6" />
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
