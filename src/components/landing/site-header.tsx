"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Package, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
   NavigationMenu,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { Locale } from "@/i18n/config";
import type { LandingMessages } from "@/i18n/types";
import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/site";

export interface SiteHeaderProps {
   locale: Locale;
   nav: LandingMessages["nav"];
   langSwitcher: LandingMessages["langSwitcher"];
}

const NAV_FRAGMENTS = ["#inicio", "#opciones-envio", "#precios", "#faq", "#contacto"] as const;

function landingSectionHref(locale: Locale, fragment: (typeof NAV_FRAGMENTS)[number]): string {
   return `/${locale}${fragment}`;
}

export function SiteHeader({ locale, nav, langSwitcher }: SiteHeaderProps): React.ReactElement {
   const [open, setOpen] = useState(false);

   const labels = [nav.home, nav.services, nav.pricing, nav.faq, nav.contact] as const;

   return (
      <header className="sticky top-0 z-50 border-b-0 bg-white/92 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] backdrop-blur-md dark:border-b dark:border-white/10 dark:bg-[#1a1a1a]/75 dark:shadow-none">
         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:gap-4 sm:px-6 lg:px-8">
            <Link
               href={landingSectionHref(locale, "#inicio")}
               className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-zinc-950 dark:text-white"
            >
               <span className="flex size-9 items-center justify-center rounded-xl bg-[#FFB800] text-zinc-950">
                  <Package className="size-5" aria-hidden />
               </span>
               TramiXpress
            </Link>

            <NavigationMenu className="hidden max-w-none flex-1 justify-center lg:flex">
               <NavigationMenuList className="gap-1">
                  {NAV_FRAGMENTS.map((fragment, i) => {
                     const href = landingSectionHref(locale, fragment);
                     return (
                     <NavigationMenuItem key={fragment}>
                        <NavigationMenuLink
                           render={<Link href={href} />}
                           active={fragment === "#inicio"}
                           className="rounded-full px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-950 data-active:bg-transparent data-active:text-amber-800 data-active:hover:bg-transparent data-active:hover:text-amber-800 data-active:underline data-active:decoration-amber-700 data-active:decoration-2 data-active:underline-offset-8 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white dark:data-active:text-[#FFB800] dark:data-active:hover:text-[#FFB800] dark:data-active:decoration-[#FFB800] xl:px-4"
                        >
                           {labels[i]}
                        </NavigationMenuLink>
                     </NavigationMenuItem>
                  );
                  })}
               </NavigationMenuList>
            </NavigationMenu>

            <div className="hidden items-center gap-2 sm:flex">
               <ThemeToggle label={nav.themeToggle} />
               <LanguageSwitcher current={locale} labels={langSwitcher} />
            </div>

            <div className="flex items-center gap-2 sm:hidden">
               <ThemeToggle label={nav.themeToggle} />
               <LanguageSwitcher current={locale} labels={langSwitcher} />
               <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-zinc-800 hover:bg-zinc-200/80 dark:text-white dark:hover:bg-white/10"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-label={open ? nav.menuClose : nav.menuOpen}
               >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
               </Button>
            </div>
         </div>

         <div
            className={cn(
               "border-t-0 bg-white px-4 py-4 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.08)] dark:border-t dark:border-white/10 dark:bg-zinc-950 dark:shadow-none sm:hidden",
               open ? "block" : "hidden",
            )}
         >
            <nav className="flex flex-col gap-2">
               {NAV_FRAGMENTS.map((fragment, i) => {
                  const href = landingSectionHref(locale, fragment);
                  return (
                  <Link
                     key={fragment}
                     href={href}
                     className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
                     onClick={() => setOpen(false)}
                  >
                     {labels[i]}
                  </Link>
                  );
               })}
               <div className="mt-2 flex flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-white/10">
                  <Button
                     variant="outline"
                     className="w-full rounded-full border-0 bg-zinc-100 text-zinc-950 hover:bg-zinc-200/90 dark:border dark:border-white/40 dark:bg-white dark:hover:bg-zinc-100"
                     render={<Link href={siteUrl} />}
                     onClick={() => setOpen(false)}
                  >
                     {nav.login}
                  </Button>
                  <Button
                     className="w-full rounded-full bg-[#FFB800] text-zinc-950 hover:bg-[#e5a800]"
                     render={<Link href={siteUrl} />}
                     onClick={() => setOpen(false)}
                  >
                     {nav.signup}
                  </Button>
               </div>
            </nav>
         </div>
      </header>
   );
}
