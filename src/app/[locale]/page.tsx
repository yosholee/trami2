import { notFound } from "next/navigation";

import { LandingSections } from "@/components/landing/landing-sections";
import { SiteHeader } from "@/components/landing/site-header";
import { HomeFaqJsonLd } from "@/components/seo/home-faq-json-ld";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const messages = getDictionary(raw);

  return (
    <div className="relative flex min-h-full flex-col overflow-x-clip bg-white dark:bg-[#1a1a1a]">
      <HomeFaqJsonLd locale={raw} />
      <div
         className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_16%,rgba(250,204,21,0.11),transparent_52%),radial-gradient(circle_at_72%_78%,rgba(0,0,0,0.055),transparent_44%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(250,204,21,0.12),transparent_55%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,0.035),transparent_46%)]"
         aria-hidden
      />
      <div className="relative z-10 flex min-h-full flex-col">
        <SiteHeader locale={raw} nav={messages.nav} langSwitcher={messages.langSwitcher} />
        <main className="flex-1">
          <LandingSections locale={raw} messages={messages} />
        </main>
      </div>
    </div>
  );
}
