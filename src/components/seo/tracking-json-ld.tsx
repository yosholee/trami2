import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteUrl } from "@/lib/site";

/** Breadcrumb markup for `/[locale]/tracking` (helps sitelinks + entity clarity vs. brochure-only peers). */
export function TrackingJsonLd({ locale }: { locale: Locale }): ReactElement {
  const m = getDictionary(locale);
  const base = siteUrl.replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: m.nav.home,
        item: `${base}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: m.tracking.heading,
        item: `${base}/${locale}/tracking`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
