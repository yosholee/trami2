import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CityPageContent } from "@/components/cities/city-page-content";
import { ContactFooter } from "@/components/landing/contact-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { CityJsonLd } from "@/components/seo/city-json-ld";
import { isLocale, locales } from "@/i18n/config";
import { citySlugs, getCityPage, getCityPages } from "@/i18n/content/city-pages";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteName, siteUrl } from "@/lib/site";

export function generateStaticParams(): { locale: string; city: string }[] {
   return locales.flatMap((locale) => citySlugs.map((city) => ({ locale, city })));
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
   const { locale: raw, city: slug } = await params;
   if (!isLocale(raw)) {
      return { title: siteName };
   }
   const city = getCityPage(raw, slug);
   if (!city) {
      return { title: siteName };
   }
   const m = getDictionary(raw);
   const t = city.meta;
   const kw = t.keywords.split(",").map((k) => k.trim()).filter(Boolean);

   return {
      title: t.title,
      description: t.description,
      keywords: kw,
      alternates: {
         canonical: `/${raw}/envios-a-cuba/${slug}`,
         languages: {
            es: `${siteUrl}/es/envios-a-cuba/${slug}`,
            en: `${siteUrl}/en/envios-a-cuba/${slug}`,
         },
      },
      openGraph: {
         type: "website",
         locale: m.meta.ogLocale,
         url: `/${raw}/envios-a-cuba/${slug}`,
         siteName,
         title: t.title,
         description: t.description,
      },
      twitter: {
         card: "summary_large_image",
         title: t.title,
         description: t.description,
      },
      robots: { index: true, follow: true },
   };
}

export default async function CityPage({
   params,
}: {
   params: Promise<{ locale: string; city: string }>;
}): Promise<ReactElement> {
   const { locale: raw, city: slug } = await params;
   if (!isLocale(raw)) {
      notFound();
   }
   const city = getCityPage(raw, slug);
   if (!city) {
      notFound();
   }
   const messages = getDictionary(raw);
   const content = getCityPages(raw);

   return (
      <div className="relative flex min-h-full flex-col overflow-x-clip bg-white dark:bg-[#1a1a1a]">
         <CityJsonLd locale={raw} city={city} />
         <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_16%,rgba(250,204,21,0.11),transparent_52%),radial-gradient(circle_at_72%_78%,rgba(0,0,0,0.055),transparent_44%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(250,204,21,0.12),transparent_55%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,0.035),transparent_46%)]"
            aria-hidden
         />
         <div className="relative z-10 flex min-h-full flex-col">
            <SiteHeader locale={raw} nav={messages.nav} langSwitcher={messages.langSwitcher} />
            <main className="flex flex-1 flex-col py-14 sm:py-20">
               <CityPageContent locale={raw} city={city} m={messages} />
               <p className="mx-auto mt-16 max-w-3xl px-4 text-center text-sm text-zinc-600 dark:text-zinc-500">
                  <Link
                     href={`/${raw}`}
                     className="font-semibold text-amber-800 underline decoration-amber-700/45 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
                  >
                     {content.backHome}
                  </Link>
               </p>
            </main>
            <ContactFooter m={messages} />
         </div>
      </div>
   );
}
