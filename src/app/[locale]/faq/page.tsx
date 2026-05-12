import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FaqPageContent } from "@/components/faq/faq-page-content";
import { ContactFooter } from "@/components/landing/contact-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteName, siteUrl } from "@/lib/site";

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: string }>;
}): Promise<Metadata> {
   const { locale: raw } = await params;
   if (!isLocale(raw)) {
      return { title: siteName };
   }
   const m = getDictionary(raw);
   const t = m.faqPage.meta;
   const kw = t.keywords.split(",").map((k) => k.trim()).filter(Boolean);

   return {
      title: t.title,
      description: t.description,
      keywords: kw,
      alternates: {
         canonical: `/${raw}/faq`,
         languages: {
            es: `${siteUrl}/es/faq`,
            en: `${siteUrl}/en/faq`,
         },
      },
      openGraph: {
         type: "website",
         locale: m.meta.ogLocale,
         url: `/${raw}/faq`,
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

export default async function FaqPage({
   params,
}: {
   params: Promise<{ locale: string }>;
}): Promise<ReactElement> {
   const { locale: raw } = await params;
   if (!isLocale(raw)) {
      notFound();
   }
   const messages = getDictionary(raw);

   return (
      <div className="relative flex min-h-full flex-col overflow-x-clip bg-white dark:bg-[#1a1a1a]">
         <FaqJsonLd locale={raw} />
         <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_16%,rgba(250,204,21,0.11),transparent_52%),radial-gradient(circle_at_72%_78%,rgba(0,0,0,0.055),transparent_44%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(250,204,21,0.12),transparent_55%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,0.035),transparent_46%)]"
            aria-hidden
         />
         <div className="relative z-10 flex min-h-full flex-col">
            <SiteHeader locale={raw} nav={messages.nav} langSwitcher={messages.langSwitcher} />
            <main className="flex flex-1 flex-col px-4 py-14 sm:px-6 sm:py-20">
               <FaqPageContent locale={raw} m={messages.faqPage} />
               <p className="mx-auto mt-16 max-w-3xl text-center text-sm text-zinc-600 dark:text-zinc-500">
                  <Link
                     href={`/${raw}`}
                     className="font-semibold text-amber-800 underline decoration-amber-700/45 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
                  >
                     {messages.faqPage.backHome}
                  </Link>
               </p>
            </main>
            <ContactFooter m={messages} />
         </div>
      </div>
   );
}
