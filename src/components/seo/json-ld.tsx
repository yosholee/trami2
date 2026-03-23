import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteName, siteUrl } from "@/lib/site";

function buildJsonLd(locale: Locale): Record<string, unknown> {
  const m = getDictionary(locale);
  const faqEntities = m.faq.items;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        description: m.meta.description,
        logo: `${siteUrl}/favicon.ico`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "1201 9th ST W",
          addressLocality: "Bradenton",
          addressRegion: "FL",
          addressCountry: "US",
        },
        areaServed: [
          { "@type": "City", name: "Sarasota", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "City", name: "Bradenton", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "City", name: "Tampa", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "Country", name: "Cuba" },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: m.meta.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: m.meta.ogLocale.replace("_", "-"),
      },
      {
        "@type": "Service",
        "@id": `${siteUrl}/#shipping-service`,
        name: `${siteName} — ${m.meta.title}`,
        description: m.meta.description,
        url: siteUrl,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: [
          { "@type": "City", name: "Sarasota", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "City", name: "Bradenton", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "City", name: "Tampa", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "Country", name: "Cuba" },
        ],
        serviceType:
          "International parcel delivery and door-to-door logistics from Florida Gulf Coast (Sarasota, Bradenton, Tampa) to Cuba",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqEntities.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };
}

export async function JsonLd({
  locale,
}: {
  locale: Locale;
}): Promise<ReactElement> {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildJsonLd(locale)),
      }}
    />
  );
}
