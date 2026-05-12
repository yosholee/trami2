import { FinalCta } from "@/components/landing/sections/final-cta-section";
import { LocationSection } from "@/components/landing/sections/location-section";
import { SocialSection } from "@/components/landing/sections/social-section";
import { DotPattern } from "@/components/ui/dot-pattern";
import type { Locale } from "@/i18n/config";
import type { LandingMessages } from "@/i18n/types";
import { cn } from "@/lib/utils";

/** Shared dot pattern behind social + location + final CTA so the band reads as one. */
export function SocialFinalCtaBand({ m, locale }: { m: LandingMessages; locale: Locale }): React.ReactElement {
   return (
      <div className="relative overflow-hidden">
         <div className="pointer-events-none absolute inset-0" aria-hidden>
            <DotPattern
               className={cn(
                  "text-zinc-900/8 dark:text-white/7",
                  "mask-[radial-gradient(ellipse_90%_85%_at_50%_45%,white_18%,transparent_72%)]",
               )}
               cr={1}
               cx={1}
               cy={1}
               height={22}
               width={22}
            />
         </div>
         <div className="relative z-10">
            <SocialSection m={m} />
            <LocationSection m={m} locale={locale} />
            <FinalCta m={m} />
         </div>
      </div>
   );
}
