import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { jsonLdScriptContent } from "@/lib/json-ld-serialize";
import { siteUrl } from "@/lib/site";

/**
 * FAQ schema for the homepage accordion only (`m.faq.items`). Must match visible Q&A.
 * Full hub: `FaqJsonLd` on `/[locale]/faq`.
 */
export function HomeFaqJsonLd({ locale }: { locale: Locale }): ReactElement {
   const m = getDictionary(locale);
   const items = m.faq.items;
   const base = siteUrl.replace(/\/$/, "");
   const pageUrl = `${base}/${locale}`;

   const graph = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#homepage-faq`,
      url: pageUrl,
      inLanguage: m.meta.ogLocale.replace("_", "-"),
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: items.map((item) => ({
         "@type": "Question",
         name: item.q,
         acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
         },
      })),
   };

   return (
      <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{
            __html: jsonLdScriptContent(graph),
         }}
      />
   );
}
