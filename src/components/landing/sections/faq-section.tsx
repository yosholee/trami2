import type { LandingMessages } from "@/i18n/types";

export function FaqSection({ m }: { m: LandingMessages }): React.ReactElement {
   const f = m.faq;
   const supportEmailHref = `mailto:${m.footer.email}`;
   return (
      <section id="faq" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="faq-heading">
         <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-[#FFB800]">
               {f.kicker}
            </p>
            <h2
               id="faq-heading"
               className="mt-2 text-center text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl"
            >
               {f.heading}
            </h2>
            <p className="mt-4 text-center text-zinc-700 dark:text-zinc-400">{f.sub}</p>
            <div className="mt-10 space-y-3">
               {f.items.map((item) => (
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
                     <p className="border-t-0 pb-4 pt-2 text-sm leading-relaxed text-zinc-700 dark:border-t dark:border-white/10 dark:text-zinc-400">
                        {item.a}
                     </p>
                  </details>
               ))}
            </div>
            <p className="mt-10 text-center text-sm text-zinc-700 dark:text-zinc-400">
               {f.moreHelp}{" "}
               <a
                  href={supportEmailHref}
                  className="font-semibold text-zinc-950 underline hover:text-amber-800 dark:text-white dark:hover:text-[#FFB800]"
               >
                  {f.supportLink}
               </a>
            </p>
         </div>
      </section>
   );
}
