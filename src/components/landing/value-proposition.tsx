"use client";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LandingMessages } from "@/i18n/types";
import { siteUrl } from "@/lib/site";

const TAB_KEYS = ["experience", "responsibility", "service"] as const;

export function ValueProposition({
  value,
}: {
  value: LandingMessages["value"];
}): React.ReactElement {
  const tabContent = {
    experience: value.experience,
    responsibility: value.responsibility,
    service: value.service,
  } as const;

  return (
    <section id="servicios" className="scroll-mt-24 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="experience" className="gap-10">
          <TabsList className="mx-auto flex h-auto w-full max-w-md flex-wrap justify-center gap-1 rounded-full border-0 bg-white p-1 shadow-md shadow-zinc-900/8 backdrop-blur-sm dark:border dark:border-white/10 dark:bg-zinc-900/55 dark:shadow-none sm:flex-nowrap">
            <TabsTrigger
              value="experience"
              className="rounded-full px-4 py-2 text-xs font-semibold text-zinc-700 data-active:bg-[#eab308] data-active:text-zinc-950 dark:text-zinc-400 dark:data-active:bg-[#FFB800] sm:text-sm"
            >
              {value.tabExperience}
            </TabsTrigger>
            <TabsTrigger
              value="responsibility"
              className="rounded-full px-4 py-2 text-xs font-semibold text-zinc-700 data-active:bg-[#eab308] data-active:text-zinc-950 dark:text-zinc-400 dark:data-active:bg-[#FFB800] sm:text-sm"
            >
              {value.tabResponsibility}
            </TabsTrigger>
            <TabsTrigger
              value="service"
              className="rounded-full px-4 py-2 text-xs font-semibold text-zinc-700 data-active:bg-[#eab308] data-active:text-zinc-950 dark:text-zinc-400 dark:data-active:bg-[#FFB800] sm:text-sm"
            >
              {value.tabService}
            </TabsTrigger>
          </TabsList>

          {TAB_KEYS.map((key) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="order-2 space-y-6 lg:order-1">
                  <Badge className="rounded-full border-0 bg-zinc-100 px-3 py-1 text-[#ca8a04] hover:bg-zinc-100 dark:border dark:border-white/10 dark:bg-zinc-900/80 dark:text-[#FFB800] dark:hover:bg-zinc-900/80">
                    {value.badge}
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl lg:text-[2.5rem] lg:leading-tight dark:text-white">
                    {tabContent[key].title}
                  </h2>
                  <p className="max-w-xl text-base leading-relaxed text-zinc-700 dark:text-zinc-400">
                    {tabContent[key].body}
                  </p>
                  <Button
                    className="h-11 rounded-full bg-[#FFB800] px-6 text-zinc-950 hover:bg-[#e5a800]"
                    render={<Link href={siteUrl} />}
                  >
                    {value.ctaQuote}
                  </Button>
                </div>
                <div className="order-1 flex justify-center lg:order-2">
                  <div className="relative aspect-square w-full max-w-md">
                    <div className="absolute inset-4 rounded-full bg-[#FFB800]/25 blur-2xl" />
                    <div className="relative mx-auto flex aspect-square w-[85%] max-w-sm items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#FFB800]/40 to-amber-200/30 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.45)] ring-0 dark:ring-4 dark:ring-[#FFB800]/30 dark:shadow-none">
                      <Image
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                        alt={value.imageAlt}
                        width={520}
                        height={520}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 1024px) 85vw, 400px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
