import Script from "next/script";

import type { ReactElement } from "react";

import { googleAnalyticsMeasurementId } from "@/lib/site";

/** Google tag (gtag.js) — GA4. Only renders when `googleAnalyticsMeasurementId` is set. */
export function GoogleAnalytics(): ReactElement | null {
   const id = googleAnalyticsMeasurementId;
   if (id === null || id === "") {
      return null;
   }

   return (
      <>
         <Script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
         <Script id={`ga-gtag-${id}`} strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
`}</Script>
      </>
   );
}
