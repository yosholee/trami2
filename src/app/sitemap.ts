import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.replace(/\/$/, "");

  const home = locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "es" ? 1 : 0.9,
    alternates: {
      languages: {
        es: `${base}/es`,
        en: `${base}/en`,
      },
    },
  }));

  const tracking = locales.map((locale) => ({
    url: `${base}/${locale}/tracking`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "es" ? 0.85 : 0.8,
    alternates: {
      languages: {
        es: `${base}/es/tracking`,
        en: `${base}/en/tracking`,
      },
    },
  }));

  const faq = locales.map((locale) => ({
    url: `${base}/${locale}/faq`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "es" ? 0.75 : 0.7,
    alternates: {
      languages: {
        es: `${base}/es/faq`,
        en: `${base}/en/faq`,
      },
    },
  }));

  return [...home, ...tracking, ...faq];
}
