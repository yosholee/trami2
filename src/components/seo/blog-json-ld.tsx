import type { ReactElement } from "react";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import type { BlogPost } from "@/i18n/types";
import { jsonLdScriptContent } from "@/lib/json-ld-serialize";
import { siteUrl } from "@/lib/site";

/** Blog index rich results for `/[locale]/blog`: WebPage + Blog with its postings. */
export function BlogIndexJsonLd({ locale }: { locale: Locale }): ReactElement {
   const m = getDictionary(locale);
   const base = siteUrl.replace(/\/$/, "");
   const pageUrl = `${base}/${locale}/blog`;
   const inLang = m.meta.ogLocale.replace("_", "-");

   const graph = {
      "@context": "https://schema.org",
      "@graph": [
         {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            name: m.blog.meta.title,
            description: m.blog.meta.description,
            inLanguage: inLang,
            isPartOf: { "@id": `${siteUrl}/#website` },
            publisher: { "@id": `${siteUrl}/#organization` },
         },
         {
            "@type": "Blog",
            "@id": `${pageUrl}#blog`,
            url: pageUrl,
            name: m.blog.meta.title,
            description: m.blog.meta.description,
            inLanguage: inLang,
            publisher: { "@id": `${siteUrl}/#organization` },
            blogPost: m.blog.posts.map((post) => ({
               "@type": "BlogPosting",
               headline: post.title,
               description: post.description,
               datePublished: post.date,
               url: `${pageUrl}/${post.slug}`,
            })),
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

/** Article rich results for `/[locale]/blog/[slug]`: WebPage + BlogPosting + BreadcrumbList. */
export function BlogPostingJsonLd({
   locale,
   post,
}: {
   locale: Locale;
   post: BlogPost;
}): ReactElement {
   const m = getDictionary(locale);
   const base = siteUrl.replace(/\/$/, "");
   const blogUrl = `${base}/${locale}/blog`;
   const pageUrl = `${blogUrl}/${post.slug}`;
   const inLang = m.meta.ogLocale.replace("_", "-");

   const graph = {
      "@context": "https://schema.org",
      "@graph": [
         {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            name: post.title,
            description: post.description,
            inLanguage: inLang,
            isPartOf: { "@id": `${siteUrl}/#website` },
            publisher: { "@id": `${siteUrl}/#organization` },
         },
         {
            "@type": "BlogPosting",
            "@id": `${pageUrl}#article`,
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: inLang,
            mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
            author: { "@id": `${siteUrl}/#organization` },
            publisher: { "@id": `${siteUrl}/#organization` },
         },
         {
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
                  name: m.nav.blog,
                  item: blogUrl,
               },
               {
                  "@type": "ListItem",
                  position: 3,
                  name: post.title,
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
