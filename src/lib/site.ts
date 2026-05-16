/** Landing hero + full page canvas base. */
export const landingHeroBackground = "#1a1a1a";

/**
 * Radial overlays shared by hero, pricing, and the rest of the landing page
 * (single continuous canvas behind header + main).
 */
export const landingPageCanvasOverlaysClass =
   "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(250,204,21,0.12),transparent_55%),radial-gradient(circle_at_72%_78%,rgba(255,255,255,0.035),transparent_46%)]";

/** Canonical marketing / product URL (tramixpress.me). Override in preview with NEXT_PUBLIC_SITE_URL. */
export const siteUrl: string = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tramixpress.me";

/**
 * GA4 measurement ID for gtag. Default: production property.
 * Disable analytics: set NEXT_PUBLIC_GA_MEASUREMENT_ID= (empty) in `.env.local`.
 */
const gaFromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const googleAnalyticsMeasurementId: string | null =
   gaFromEnv === "" ? null : gaFromEnv?.trim() || "G-W8YRG6HGJD";

/** Official Facebook page (Bradenton, FL). */
export const socialFacebookUrl = "https://www.facebook.com/TramiXpress/";

/** Official TikTok profile (@tramixpress_). */
export const socialTiktokUrl = "https://www.tiktok.com/@tramixpress_";

/** Technology / tracking partner site. */
export const ctEnviosUrl = "https://ctenvios.com";

/** Google Search for TramiXpress (Business / reviews surface in results). */
export const socialGoogleUrl = "https://www.google.com/search?q=TramiXpress+Sarasota+Bradenton+Tampa+Cuba+shipping";

/** WhatsApp Business number for wa.me (digits only, with country code, no +). Matches public support line. */
export const whatsappBusinessNumber = "19412782357";

export function whatsappChatUrl(prefillMessage?: string): string {
   const base = `https://wa.me/${whatsappBusinessNumber}`;
   if (prefillMessage?.trim()) {
      return `${base}?text=${encodeURIComponent(prefillMessage.trim())}`;
   }
   return base;
}

/**
 * Deep link to look up a shipment on the main TramiXpress app (opens in a new tab from the marketing site).
 * Set NEXT_PUBLIC_TRACKING_URL_TEMPLATE with a literal `{{id}}` placeholder to override (e.g. https://tramixpress.me/rastreo?guia={{id}}).
 */
export function trackingUrlForId(trackingId: string): string {
   const trimmed = trackingId.trim();
   if (!trimmed) {
      return siteUrl;
   }
   const tpl = process.env.NEXT_PUBLIC_TRACKING_URL_TEMPLATE;
   if (tpl?.includes("{{id}}")) {
      return tpl.replace(/\{\{id\}\}/g, encodeURIComponent(trimmed));
   }
   const base = siteUrl.replace(/\/$/, "");
   return `${base}/track?code=${encodeURIComponent(trimmed)}`;
}

export const siteName = "TramiXpress";

export const siteDescription =
   "Door-to-door shipping to Cuba from Sarasota, Bradenton, and Tampa. Bradenton location serving nearby Gulf Coast families with air and sea shipping, food and medicine combos, tracking, insurance, and 24/7 support.";

export const siteTagline =
   "Cuba shipping from Sarasota, Bradenton & Tampa—Bradenton location for packages, food, essentials, and medicine.";

export const keywords: string[] = [
   "shipping to Cuba from Sarasota",
   "shipping to Cuba Bradenton",
   "shipping to Cuba Tampa",
   "packages to Cuba Sarasota",
   "packages to Cuba Bradenton",
   "packages to Cuba Tampa",
   "Tampa Bay Cuba shipping",
   "Gulf Coast Florida to Cuba",
   "door to door Cuba",
   "air shipping Cuba",
   "sea freight Cuba",
   "food and medicine to Cuba",
   "TramiXpress",
   "envíos a Cuba",
   "paquetes a Cuba",
   "Havana delivery",
];
