import { type NextRequest, NextResponse } from "next/server";

import { hmHistorialBaseUrl } from "@/lib/tracking-lookup-server";

const FETCH_MS = 10_000;

function fetchWithTimeout(url: string, ms: number): Promise<Response> {
   const controller = new AbortController();
   const t = setTimeout(() => controller.abort(), ms);
   return fetch(url, { signal: controller.signal, cache: "no-store" }).finally(() => clearTimeout(t));
}

export async function GET(
   _req: NextRequest,
   context: { params: Promise<{ hbl: string }> },
): Promise<NextResponse> {
   const { hbl: raw } = await context.params;
   const hbl = raw?.trim();
   if (!hbl) {
      return NextResponse.json({ historial: [] }, { status: 400 });
   }

   const base = hmHistorialBaseUrl().replace(/\/$/, "");
   const url = `${base}/${encodeURIComponent(hbl)}/`;

   try {
      const response = await fetchWithTimeout(url, FETCH_MS);
      if (!response.ok) {
         return NextResponse.json({ historial: [] }, { status: response.status });
      }
      const data: unknown = await response.json();
      return NextResponse.json(data);
   } catch {
      return NextResponse.json({ historial: [] }, { status: 504 });
   }
}
