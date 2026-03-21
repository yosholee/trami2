import type { Metadata } from "next";
import type { ReactNode } from "react";

import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteName, siteUrl } from "@/lib/site";

export function generateStaticParams(): { locale: string }[] {
  return locales.map((locale) => ({ locale }));
}

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
  const kw = m.meta.keywords.split(",").map((k) => k.trim()).filter(Boolean);

  return {
    title: m.meta.title,
    description: m.meta.description,
    keywords: kw,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    alternates: {
      canonical: `/${raw}`,
      languages: {
        es: `${siteUrl}/es`,
        en: `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: m.meta.ogLocale,
      url: `/${raw}`,
      siteName,
      title: m.meta.title,
      description: m.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: m.meta.title,
      description: m.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    category: "shipping",
  };
}

export default function LocaleLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): React.ReactElement {
  return <>{children}</>;
}
