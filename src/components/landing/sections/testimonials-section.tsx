import { Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LandingMessages } from "@/i18n/types";

const TESTIMONIAL_IMAGES = [
   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
   "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
] as const;

export function Testimonials({ m }: { m: LandingMessages }): React.ReactElement {
   const t = m.testimonials;
   return (
      <section id="testimonios" className="scroll-mt-24 py-16 sm:py-24">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
               <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
                  {t.heading}
               </h2>
               <p className="mt-4 text-zinc-700 dark:text-zinc-400">{t.sub}</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
               {t.items.map((item, index) => (
                  <Card
                     key={item.name}
                     className="rounded-2xl border-0 bg-white/80 shadow-md shadow-zinc-900/6 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-none"
                  >
                     <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <Avatar size="lg" className="size-12">
                           <AvatarImage src={TESTIMONIAL_IMAGES[index]} alt={`${item.name}, ${item.role}`} />
                           <AvatarFallback className="bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                              {item.initials}
                           </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                           <CardTitle className="text-base text-zinc-800 dark:text-zinc-100">{item.name}</CardTitle>
                           <CardDescription className="text-zinc-700 dark:text-zinc-400">{item.role}</CardDescription>
                           <div
                              className="mt-2 flex gap-0.5 text-amber-600 dark:text-[#FFB800]"
                              aria-label={t.starsLabel}
                           >
                              {Array.from({ length: 5 }).map((_, i) => (
                                 <Star key={i} className="size-4 fill-current" aria-hidden />
                              ))}
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                           &ldquo;{item.quote}&rdquo;
                        </p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </section>
   );
}
