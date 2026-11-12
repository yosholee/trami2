import type { Metadata } from "next";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";

import { BlogArticleContent } from "@/components/blog/blog-article-content";
import { ContactFooter } from "@/components/landing/contact-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { BlogPostingJsonLd } from "@/components/seo/blog-json-ld";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { siteName, siteUrl } from "@/lib/site";

export function generateStaticParams(): { locale: string; slug: string }[] {
   const slugs = getDictionary("es").blog.posts.map((p) => p.slug);
   return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
   params,
}: {
   params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
   const { locale: raw, slug } = await params;
   if (!isLocale(raw)) {
      return { title: siteName };
   }
   const m = getDictionary(raw);
   const post = m.blog.posts.find((p) => p.slug === slug);
   if (!post) {
      return { title: siteName };
   }
   const kw = post.keywords.split(",").map((k) => k.trim()).filter(Boolean);

   return {
      title: `${post.title} | TramiXpress`,
      description: post.description,
      keywords: kw,
      alternates: {
         canonical: `/${raw}/blog/${slug}`,
         languages: {
            es: `${siteUrl}/es/blog/${slug}`,
            en: `${siteUrl}/en/blog/${slug}`,
         },
      },
      openGraph: {
         type: "article",
         locale: m.meta.ogLocale,
         url: `/${raw}/blog/${slug}`,
         siteName,
         title: post.title,
         description: post.description,
         publishedTime: post.date,
      },
      twitter: {
         card: "summary_large_image",
         title: post.title,
         description: post.description,
      },
      robots: { index: true, follow: true },
   };
}

export default async function BlogArticlePage({
   params,
}: {
   params: Promise<{ locale: string; slug: string }>;
}): Promise<ReactElement> {
   const { locale: raw, slug } = await params;
   if (!isLocale(raw)) {
      notFound();
   }
   const messages = getDictionary(raw);
   const post = messages.blog.posts.find((p) => p.slug === slug);
   if (!post) {
      notFound();
   }

   return (
      <div className="relative flex min-h-full flex-col overflow-x-clip bg-white dark:bg-[#1a1a1a]">
         <BlogPostingJsonLd locale={raw} post={post} />
         <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_16%,rgba(250,204,21,0.11),transparent_52%),radial-gradient(circle_at_72%_78%,rgba(0,0,0,0.055),transparent_44%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(250,204,21,0.12),transparent_55%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,0.035),transparent_46%)]"
            aria-hidden
         />
         <div className="relative z-10 flex min-h-full flex-col">
            <SiteHeader locale={raw} nav={messages.nav} langSwitcher={messages.langSwitcher} />
            <main className="flex flex-1 flex-col px-4 py-14 sm:px-6 sm:py-20">
               <BlogArticleContent locale={raw} m={messages.blog} post={post} />
            </main>
            <ContactFooter m={messages} />
         </div>
      </div>
   );
}
