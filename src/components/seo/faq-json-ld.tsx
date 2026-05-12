import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { FaqItem } from "@/i18n/types";
import { jsonLdScriptContent } from "@/lib/json-ld-serialize";
import { siteName, siteUrl } from "@/lib/site";

function mainEntityFromFaqItems(items: FaqItem[]): Record<string, unknown>[] {
   return items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
         "@type": "Answer",
         text: item.a,
      },
   }));
}

/**
 * FAQ rich results for `/[locale]/faq`. Uses @graph (WebPage + FAQPage) per schema.org;
 * `mainEntity` matches visible `<details>` content.
 */
export function FaqJsonLd({ locale }: { locale: Locale }): ReactElement {
   const m = getDictionary(locale);
   const items = m.faqPage.sections.flatMap((s) => s.items);
   const base = siteUrl.replace(/\/$/, "");
   const pageUrl = `${base}/${locale}/faq`;
   const webPageId = `${pageUrl}#webpage`;
   const faqId = `${pageUrl}#faqpage`;
   const inLang = m.meta.ogLocale.replace("_", "-");
   const pageName = m.faqPage.meta.title;

   const graph = {
      "@context": "https://schema.org",
      "@graph": [
         {
            "@type": "WebPage",
            "@id": webPageId,
            url: pageUrl,
            name: pageName,
            description: m.faqPage.meta.description,
            inLanguage: inLang,
            isPartOf: { "@id": `${siteUrl}/#website` },
            publisher: { "@id": `${siteUrl}/#organization` },
            mainEntity: { "@id": faqId },
         },
         {
            "@type": "FAQPage",
            "@id": faqId,
            url: pageUrl,
            name: pageName,
            inLanguage: inLang,
            isPartOf: { "@id": `${siteUrl}/#website` },
            about: {
               "@type": "Thing",
               name: siteName,
            },
            mainEntity: mainEntityFromFaqItems(items),
         },
      ],
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
