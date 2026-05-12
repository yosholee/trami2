import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  siteName,
  siteUrl,
  socialFacebookUrl,
  socialGoogleUrl,
  socialTiktokUrl,
  whatsappBusinessNumber,
} from "@/lib/site";

function buildJsonLd(locale: Locale): Record<string, unknown> {
  const m = getDictionary(locale);

  const base = siteUrl.replace(/\/$/, "");
  const trackingSearchTemplate = `${base}/${locale}/tracking?search={search_term_string}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        description: m.meta.description,
        logo: `${siteUrl}/android-chrome-512x512.png`,
        image: `${siteUrl}/android-chrome-512x512.png`,
        telephone: "+1-941-278-2357",
        priceRange: "$$",
        sameAs: [socialFacebookUrl, socialTiktokUrl, socialGoogleUrl],
        address: {
          "@type": "PostalAddress",
          streetAddress: "1201 9th ST W",
          addressLocality: "Bradenton",
          addressRegion: "FL",
          postalCode: "34205",
          addressCountry: "US",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: "+1-941-278-2357",
            availableLanguage: ["English", "Spanish"],
            areaServed: ["US", "CU"],
          },
          {
            "@type": "ContactPoint",
            contactType: "WhatsApp support",
            url: `https://wa.me/${whatsappBusinessNumber}`,
            availableLanguage: ["English", "Spanish"],
            areaServed: ["US", "CU"],
          },
        ],
        areaServed: [
          { "@type": "City", name: "Sarasota", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "City", name: "Bradenton", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "City", name: "Tampa", containedInPlace: { "@type": "State", name: "Florida" } },
          { "@type": "AdministrativeArea", name: "Tampa Bay" },
          { "@type": "AdministrativeArea", name: "Florida Gulf Coast" },
          { "@type": "Country", name: "Cuba" },
        ],
        knowsAbout: [
          "International parcel shipping to Cuba",
          "Florida Gulf Coast door-to-door cargo",
          "Air and sea freight to Cuba",
          "Food and medicine shipments to Cuba",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${base}/${locale}`,
        name: siteName,
        description: m.meta.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage: m.meta.ogLocale.replace("_", "-"),
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: trackingSearchTemplate,
          },
          "query-input": "required name=search_term_string",
        },
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
