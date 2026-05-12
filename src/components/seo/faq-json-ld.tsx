import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteUrl } from "@/lib/site";

export function FaqJsonLd({ locale }: { locale: Locale }): ReactElement {
   const m = getDictionary(locale);
   const items = m.faqPage.sections.flatMap((s) => s.items);
   const base = siteUrl.replace(/\/$/, "");
   const graph = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${base}/${locale}/faq#webpage`,
      url: `${base}/${locale}/faq`,
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
            __html: JSON.stringify(graph),
         }}
      />
   );
}
