import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LandingMessages } from "@/i18n/types";
import { siteUrl } from "@/lib/site";

/** Not currently composed in `LandingSections`; kept for reuse or future layout. */
export function HowItWorks({ m }: { m: LandingMessages }): React.ReactElement {
   const h = m.how;
   const icons = [Truck, CheckCircle2, ShieldCheck] as const;
   const items = h.items.map((item, i) => ({
      icon: icons[i],
      title: item.title,
      text: item.text,
   }));

   return (
      <section className="py-16 sm:py-24">
         <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div className="relative flex justify-center">
               <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#FFB800]/20 to-transparent blur-3xl" />
               <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
                  alt={h.imageAlt}
                  width={520}
                  height={600}
                  className="max-h-[min(520px,70vh)] w-full max-w-md rounded-3xl object-cover shadow-xl ring-0 dark:ring-1 dark:ring-white/10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
               />
            </div>
            <div className="space-y-8">
               <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  {h.heading}
               </h2>
               <ul className="space-y-6">
                  {items.map(({ icon: Icon, title, text }) => (
                     <li key={title} className="flex gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-200/90 text-amber-900 dark:bg-[#FFB800]/20 dark:text-[#FFB800]">
                           <Icon className="size-5" aria-hidden />
                        </span>
                        <div>
                           <p className="font-semibold text-zinc-800 dark:text-zinc-100">{title}</p>
                           <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-400">{text}</p>
                        </div>
                     </li>
                  ))}
               </ul>
               <Button
                  className="h-11 rounded-full bg-zinc-900 px-6 text-white hover:bg-zinc-800 dark:bg-zinc-950"
                  render={<Link href={siteUrl} />}
               >
                  {h.cta}
               </Button>
            </div>
         </div>
      </section>
   );
}
