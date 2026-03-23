import type { LandingMessages } from "@/i18n/types";

/** Not currently composed in `LandingSections`; kept for reuse or future layout. */
export function TrustStats({ m }: { m: LandingMessages }): React.ReactElement {
   const t = m.trust;
   const items = [
      { title: t.fastTitle, detail: t.fastDetail },
      { title: t.secureTitle, detail: t.secureDetail },
      { title: t.supportTitle, detail: t.supportDetail },
   ] as const;

   return (
      <section className="border-y-0 py-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05),0_-1px_0_0_rgba(0,0,0,0.05)] dark:border-y dark:border-white/10 dark:shadow-none sm:py-12">
         <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl">
               {t.heading}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
               {items.map((item) => (
                  <div
                     key={item.title}
                     className="rounded-2xl border-0 bg-white/80 p-6 text-center shadow-md shadow-zinc-900/6 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-none sm:text-left"
                  >
                     <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{item.title}</h3>
                     <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{item.detail}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
