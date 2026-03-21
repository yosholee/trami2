type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Default for tracking lookup API: 15 requests / minute / IP. */
export const TRACKING_LOOKUP_LIMIT = 15;
export const TRACKING_LOOKUP_WINDOW_MS = 60_000;

function clientIpFromRequest(req: Request): string {
   const xff = req.headers.get("x-forwarded-for");
   if (xff) {
      const first = xff.split(",")[0]?.trim();
      if (first) {
         return first;
      }
   }
   return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Legacy shape for `src/api/tracking/lookup/route.js`: same bucket key as App Router lookup.
 */
export function checkRateLimit(request: Request): {
   allowed: boolean;
   remaining: number;
   resetIn: number;
} {
   const ip = clientIpFromRequest(request);
   const key = `tracking-lookup:${ip}`;
   const now = Date.now();
   let b = buckets.get(key);
   if (!b || now >= b.resetAt) {
      b = { count: 0, resetAt: now + TRACKING_LOOKUP_WINDOW_MS };
      buckets.set(key, b);
   }
   b.count += 1;
   const allowed = b.count <= TRACKING_LOOKUP_LIMIT;
   const remaining = Math.max(0, TRACKING_LOOKUP_LIMIT - b.count);
   const resetIn = Math.max(0, Math.ceil((b.resetAt - now) / 1000));
   return { allowed, remaining, resetIn };
}

/**
 * Sliding-window style limiter (per key). Returns true if the call is allowed.
 * Not durable across serverless cold starts; good enough for basic abuse protection.
 */
export function allowRateLimit(key: string, limit: number, windowMs: number): boolean {
   const now = Date.now();
   let b = buckets.get(key);
   if (!b || now >= b.resetAt) {
      b = { count: 0, resetAt: now + windowMs };
      buckets.set(key, b);
   }
   b.count += 1;
   return b.count <= limit;
}
