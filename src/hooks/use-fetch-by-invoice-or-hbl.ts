import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { TrackingInvoice } from "@/lib/tracking-types";

/** Stable code from GET /api/tracking/lookup when rate limited. */
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

function buildLookupUrl(parsed: ParsedTrackingQuery): string {
   const p = new URLSearchParams();
   if (parsed.kind === "order_id") {
      p.set("order_id", parsed.value);
   } else {
      p.set("tracking", parsed.value);
   }
   return `/api/tracking/lookup?${p.toString()}`;
}

function readErrorCode(data: unknown): string | null {
   if (typeof data === "object" && data !== null && "error" in data) {
      const e = (data as { error: unknown }).error;
      return typeof e === "string" ? e : null;
   }
   return null;
}

async function fetchInvoice(parsed: ParsedTrackingQuery): Promise<TrackingInvoice> {
   const res = await fetch(buildLookupUrl(parsed));
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

export function useFetchByInvoiceOrHBL(searchTerm: string): ReturnType<
   typeof useQuery<TrackingInvoice, Error>
> {
   const parsed = useMemo(() => parseTrackingSearchTerm(searchTerm), [searchTerm]);

   return useQuery({
      queryKey: ["tracking-lookup", parsed?.kind, parsed?.value] as const,
      queryFn: () => {
         if (!parsed) {
            throw new Error("No query");
         }
         return fetchInvoice(parsed);
      },
      enabled: parsed !== null,
   });
}
