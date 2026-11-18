import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { CityPage } from "@/i18n/types";
import { jsonLdScriptContent } from "@/lib/json-ld-serialize";
import { siteName, siteUrl } from "@/lib/site";

/**
 * WebPage + FAQPage + BreadcrumbList graph for `/[locale]/envios-a-cuba/[city]`.
 * `mainEntity` matches the visible `<details>` FAQ content on the page.
 */
export function CityJsonLd({ locale, city }: { locale: Locale; city: CityPage }): ReactElement {
   const m = getDictionary(locale);
   const base = siteUrl.replace(/\/$/, "");
   const pageUrl = `${base}/${locale}/envios-a-cuba/${city.slug}`;
   const homeUrl = `${base}/${locale}`;
   const webPageId = `${pageUrl}#webpage`;
   const faqId = `${pageUrl}#faqpage`;
   const inLang = m.meta.ogLocale.replace("_", "-");

   const graph = {
      "@context": "https://schema.org",
      "@graph": [
         {
            "@type": "WebPage",
            "@id": webPageId,
            url: pageUrl,
            name: city.meta.title,
            description: city.meta.description,
            inLanguage: inLang,
            isPartOf: { "@id": `${siteUrl}/#website` },
            publisher: { "@id": `${siteUrl}/#organization` },
            mainEntity: { "@id": faqId },
         },
         {
            "@type": "FAQPage",
            "@id": faqId,
            url: pageUrl,
            name: city.meta.title,
            inLanguage: inLang,
            isPartOf: { "@id": `${siteUrl}/#website` },
            about: {
               "@type": "Thing",
               name: siteName,
            },
            mainEntity: city.faqs.map((item) => ({
               "@type": "Question",
               name: item.q,
               acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
               },
            })),
         },
         {
            "@type": "BreadcrumbList",
            itemListElement: [
               {
                  "@type": "ListItem",
                  position: 1,
                  name: siteName,
                  item: homeUrl,
               },
               {
                  "@type": "ListItem",
                  position: 2,
                  name: city.heading,
                  item: pageUrl,
               },
            ],
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
