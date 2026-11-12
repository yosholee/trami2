import type { ReactElement } from "react";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { BlogPost, LandingMessages } from "@/i18n/types";
import { whatsappChatUrl } from "@/lib/site";

export function BlogArticleContent({
   locale,
   m,
   post,
}: {
   locale: Locale;
   m: LandingMessages["blog"];
   post: BlogPost;
}): ReactElement {
   return (
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:max-w-4xl lg:px-8">
         <p className="text-sm">
            <Link
               href={`/${locale}/blog`}
               className="font-semibold text-amber-800 underline decoration-amber-700/45 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
            >
               {m.backToBlog}
            </Link>
         </p>

         <header className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">{post.dateLabel}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{post.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-400 sm:text-lg">{post.description}</p>
         </header>

         <div className="mt-12 space-y-12">
            {post.sections.map((section) => (
               <section key={section.heading}>
                  <h2 className="border-b border-zinc-200 pb-3 text-lg font-semibold tracking-tight text-zinc-950 dark:border-white/15 dark:text-white">
                     {section.heading}
                  </h2>
                  <div className="mt-5 space-y-4">
                     {section.paragraphs.map((p) => (
                        <p key={p.slice(0, 32)} className="text-base leading-relaxed text-zinc-700 dark:text-zinc-400">
                           {p}
                        </p>
                     ))}
                     {section.list ? (
                        <ul className="space-y-2.5">
                           {section.list.map((item) => (
                              <li key={item.slice(0, 32)} className="flex gap-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-400">
                                 <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-amber-600 dark:bg-[#FFB800]" />
                                 <span>{item}</span>
                              </li>
                           ))}
                        </ul>
                     ) : null}
                  </div>
               </section>
            ))}
         </div>

         <aside className="mt-16 rounded-2xl bg-zinc-950 p-6 text-center dark:bg-zinc-900 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-white">{m.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">{m.ctaBody}</p>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-4">
               <a
                  href={whatsappChatUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#FFB800] px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-[#e6ac00]"
               >
                  {m.ctaWhatsapp}
               </a>
               <Link
                  href={`/${locale}/tracking`}
                  className="text-sm font-semibold text-[#facc15] underline decoration-[#facc15]/40 underline-offset-4 hover:text-[#fde047]"
               >
                  {m.ctaTracking}
               </Link>
            </p>
         </aside>
      </div>
   );
}
