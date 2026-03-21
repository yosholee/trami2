import { type NextRequest, NextResponse } from "next/server";

import {
   TRACKING_LOOKUP_LIMIT,
   TRACKING_LOOKUP_WINDOW_MS,
   allowRateLimit,
} from "@/lib/rate-limit";
import {
   runTrackingLookup,
   stripCteSuffix,
   validateLookupInput,
} from "@/lib/tracking-lookup-server";

function clientIp(req: NextRequest): string {
   const xff = req.headers.get("x-forwarded-for");
   if (xff) {
      const first = xff.split(",")[0]?.trim();
      if (first) {
         return first;
      }
   }
   return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(req: NextRequest): Promise<NextResponse> {
   const ip = clientIp(req);
   if (!allowRateLimit(`tracking-lookup:${ip}`, TRACKING_LOOKUP_LIMIT, TRACKING_LOOKUP_WINDOW_MS)) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
   }

   const tracking = req.nextUrl.searchParams.get("tracking")?.trim();
   const orderId = req.nextUrl.searchParams.get("order_id")?.trim();

   if (tracking && orderId) {
      return NextResponse.json({ error: "invalid_params" }, { status: 400 });
   }
   if (!tracking && !orderId) {
      return NextResponse.json({ error: "missing_query" }, { status: 400 });
   }

   const rawValue = orderId ?? tracking ?? "";
   const validation = validateLookupInput(rawValue);
   if (!validation.ok) {
      return NextResponse.json({ error: "invalid_params" }, { status: 400 });
   }

   const trimmedId = stripCteSuffix(validation.trimmed);
   if (!trimmedId) {
      return NextResponse.json({ error: "invalid_params" }, { status: 400 });
   }

   const isOrderId = /^\d+$/.test(trimmedId);

   try {
      const payload = await runTrackingLookup(trimmedId, isOrderId);
      return NextResponse.json(payload);
   } catch {
      return NextResponse.json({ error: "not_found", message: "No se encontró el envío" }, { status: 404 });
   }
}
