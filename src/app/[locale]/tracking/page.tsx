import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ContactFooter } from "@/components/landing/contact-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { TrackingJsonLd } from "@/components/seo/tracking-json-ld";
import { TrackingSearchSection } from "@/components/tracking/tracking-search-section";
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
  const t = m.tracking.meta;
  const kw = t.keywords.split(",").map((k) => k.trim()).filter(Boolean);

  return {
    title: t.title,
    description: t.description,
    keywords: kw,
    alternates: {
      canonical: `/${raw}/tracking`,
      languages: {
        es: `${siteUrl}/es/tracking`,
        en: `${siteUrl}/en/tracking`,
      },
    },
    openGraph: {
      type: "website",
      locale: m.meta.ogLocale,
      url: `/${raw}/tracking`,
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

export default async function TrackingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string }>;
}): Promise<ReactElement> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const sp = await searchParams;
  const messages = getDictionary(raw);
  const t = messages.tracking;
  const initialSearch = typeof sp.search === "string" ? sp.search : "";

  return (
    <div className="relative flex min-h-full flex-col overflow-x-clip bg-white dark:bg-[#1a1a1a]">
      <TrackingJsonLd locale={raw} />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_16%,rgba(250,204,21,0.11),transparent_52%),radial-gradient(circle_at_72%_78%,rgba(0,0,0,0.055),transparent_44%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(250,204,21,0.12),transparent_55%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,0.035),transparent_46%)]"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-full flex-col">
        <SiteHeader locale={raw} nav={messages.nav} langSwitcher={messages.langSwitcher} />
        <main className="flex flex-1 flex-col px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto w-full max-w-2xl text-center lg:max-w-6xl xl:max-w-7xl">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{t.heading}</h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-zinc-700 dark:text-zinc-400">{t.sub}</p>
            <Suspense
              fallback={
                <p className="mx-auto mt-10 text-sm text-zinc-600 dark:text-zinc-400">{t.suspenseFallback}</p>
              }
            >
              <TrackingSearchSection initialSearch={initialSearch} labels={t} />
            </Suspense>
            <p className="mt-10">
              <Link
                href={`/${raw}`}
                className="text-sm font-semibold text-amber-800 underline decoration-amber-700/45 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
              >
                {t.backHome}
              </Link>
            </p>
          </div>
        </main>
        <ContactFooter m={messages} />
      </div>
    </div>
  );
}
