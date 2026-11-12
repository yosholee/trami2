import type { ReactElement } from "react";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { LandingMessages } from "@/i18n/types";

export function BlogIndexContent({
   locale,
   m,
}: {
   locale: Locale;
   m: LandingMessages["blog"];
}): ReactElement {
   return (
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:max-w-4xl lg:px-8">
         <header className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-[#FFB800]">{m.kicker}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{m.heading}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-700 dark:text-zinc-400">{m.sub}</p>
         </header>

         <div className="mt-14 space-y-6">
            {m.posts.map((post) => (
               <article
                  key={post.slug}
                  className="rounded-2xl bg-white p-6 shadow-sm shadow-zinc-900/5 dark:border dark:border-white/10 dark:bg-zinc-900/50 dark:shadow-none sm:p-8"
               >
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">{post.dateLabel}</p>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">
                     <Link href={`/${locale}/blog/${post.slug}`} className="transition-colors hover:text-amber-800 dark:hover:text-[#FFB800]">
                        {post.title}
                     </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400 sm:text-base">{post.description}</p>
                  <p className="mt-5">
                     <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="text-sm font-semibold text-amber-800 underline decoration-amber-700/45 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
                     >
                        {m.readMore}
                     </Link>
                  </p>
               </article>
            ))}
         </div>
      </div>
   );
}
