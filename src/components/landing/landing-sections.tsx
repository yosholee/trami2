import { ContactFooter } from "@/components/landing/contact-footer";
import { FaqSection } from "@/components/landing/sections/faq-section";
import { FeaturesDark } from "@/components/landing/sections/features-dark-section";
import { HeroSection } from "@/components/landing/sections/hero-section";
import { LocalAreasSection } from "@/components/landing/sections/local-areas-section";
import { PricingSection } from "@/components/landing/sections/pricing-section";
import { ServicesSection } from "@/components/landing/sections/services-section";
import { SocialFinalCtaBand } from "@/components/landing/sections/social-final-cta-band";
import { Testimonials } from "@/components/landing/sections/testimonials-section";
import type { Locale } from "@/i18n/config";
import type { LandingMessages } from "@/i18n/types";

export { GlobalReach } from "@/components/landing/sections/global-reach-section";
export { HowItWorks } from "@/components/landing/sections/how-it-works-section";
export { TrustStats } from "@/components/landing/sections/trust-stats-section";

export function LandingSections({
   messages: m,
   locale,
}: {
   messages: LandingMessages;
   locale: Locale;
}): React.ReactElement {
   return (
      <>
         <HeroSection m={m} locale={locale} />
         <PricingSection m={m} />
         <SocialFinalCtaBand m={m} locale={locale} />
         <ServicesSection m={m} />
         <LocalAreasSection m={m} />
         <FeaturesDark m={m} />
         <Testimonials m={m} />
         <FaqSection m={m} locale={locale} />
         <ContactFooter m={m} />
      </>
   );
}
