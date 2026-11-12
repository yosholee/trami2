import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
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

  const blog = locales.map((locale) => ({
    url: `${base}/${locale}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: locale === "es" ? 0.75 : 0.7,
    alternates: {
      languages: {
        es: `${base}/es/blog`,
        en: `${base}/en/blog`,
      },
    },
  }));

  const blogPosts = locales.flatMap((locale) =>
    getDictionary(locale).blog.posts.map((post) => ({
      url: `${base}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: locale === "es" ? 0.7 : 0.65,
      alternates: {
        languages: {
          es: `${base}/es/blog/${post.slug}`,
          en: `${base}/en/blog/${post.slug}`,
        },
      },
    })),
  );

  return [...home, ...tracking, ...faq, ...blog, ...blogPosts];
}
