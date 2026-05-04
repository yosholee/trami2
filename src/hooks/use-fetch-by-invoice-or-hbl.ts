import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { TrackingInvoice } from "@/lib/tracking-types";

export const TRACKING_ERROR_RATE_LIMITED = "rate_limited";
export const TRACKING_ERROR_NOT_CONFIGURED = "not_configured";

export type ParsedTrackingQuery =
   | { kind: "order_id"; value: string }
   | { kind: "tracking"; value: string };

/**
 * - Empty / whitespace → no request
 * - Only digits → order_id
 * - Non-digits, length &lt; 3 → no request
 * - Otherwise → tracking; trailing CTE/cte stripped
 */
export function parseTrackingSearchTerm(raw: string): ParsedTrackingQuery | null {
   const t = raw.trim();
   if (!t) {
      return null;
   }
   if (/^\d+$/.test(t)) {
      return { kind: "order_id", value: t };
   }
   if (t.length < 3) {
      return null;
   }
   const stripped = t.replace(/(?:CTE|cte)$/i, "").trim();
   if (!stripped) {
      return null;
   }
   return { kind: "tracking", value: stripped };
}

function normalizeTrackingOrigin(raw: string): string {
   const t = raw.trim();
   const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`;
   return new URL(withScheme).origin;
}

/** Client-side upstream base (`NEXT_PUBLIC_TRACKING_NEW_URL` or `https://api.ctenvios.com`). */
function trackingLookupOrigin(): string {
   const raw = process.env.NEXT_PUBLIC_TRACKING_NEW_URL?.trim();
   if (raw) {
      return normalizeTrackingOrigin(raw);
   }
   return "https://api.ctenvios.com";
}

function buildUpstreamLookupUrl(parsed: ParsedTrackingQuery): string {
   const origin = trackingLookupOrigin();
   const qs = new URLSearchParams(
      parsed.kind === "order_id" ? { order_id: parsed.value } : { tracking: parsed.value },
   );
   return `${origin}/api/v1/tracking/lookup/${parsed.value}`;
}

function readErrorCode(data: unknown): string | null {
   if (typeof data === "object" && data !== null && "error" in data) {
      const e = (data as { error: unknown }).error;
      return typeof e === "string" ? e : null;
   }
   return null;
}

async function fetchInvoice(parsed: ParsedTrackingQuery): Promise<TrackingInvoice> {
   const headers = new Headers();
   headers.set("Accept", "application/json");
   const apiKey = process.env.NEXT_PUBLIC_TRACKING_API_KEY?.trim();
   if (apiKey) {
      headers.set("Authorization", `Bearer ${apiKey}`);
   }

   const res = await fetch(buildUpstreamLookupUrl(parsed), { headers, cache: "no-store" });

   let data: unknown;
   try {
      data = await res.json();
   } catch {
      if (!res.ok && res.status === 429) {
         throw new Error(TRACKING_ERROR_RATE_LIMITED);
      }
      throw new Error("Invalid JSON from tracking service.");
   }
   if (!res.ok) {
      const code = readErrorCode(data);
      if (res.status === 429 || code === TRACKING_ERROR_RATE_LIMITED) {
         throw new Error(TRACKING_ERROR_RATE_LIMITED);
      }
      if (code === TRACKING_ERROR_NOT_CONFIGURED) {
         throw new Error(TRACKING_ERROR_NOT_CONFIGURED);
      }
      throw new Error(code ?? `Request failed (${res.status})`);
   }
   return data as TrackingInvoice;
}

export function useFetchByInvoiceOrHBL(searchTerm: string): ReturnType<typeof useQuery<TrackingInvoice, Error>> {
   const parsed = useMemo(() => parseTrackingSearchTerm(searchTerm), [searchTerm]);

   return useQuery({
      queryKey: ["tracking-lookup-upstream", trackingLookupOrigin(), parsed?.kind, parsed?.value] as const,
      queryFn: () => {
         if (!parsed) {
            throw new Error("No query");
         }
         return fetchInvoice(parsed);
      },
      enabled: parsed !== null,
      staleTime: 1000 * 60 * 5,
   });
}
