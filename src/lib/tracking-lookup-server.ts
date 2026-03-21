import { mergeAndNormalizeEvents } from "@/lib/tracking-event-merge";

/**
 * Server-only: production API first → new API fallback → HM historial per HBL.
 *
 * Production (`tracking.ctenvios.com`) requires header `api-key`: set `TRACKING_PRODUCTION_API_KEY` or
 * `TRACKING_API_KEY`; otherwise a built-in default is used for `DEFAULT_PRODUCTION_BASE`.
 */

const DEFAULT_NEW_ORIGIN = "https://api.ctenvios.com";
const DEFAULT_PRODUCTION_BASE = "https://tracking.ctenvios.com/api/v1";
/** `api-key` for production when `TRACKING_API_KEY` is unset (override with env in deployment). */
const API_KEY = process.env.TRACKING_API_KEY ?? "c3VwYmFzZWNyZXQ=";
const DEFAULT_HM_HISTORIAL_BASE = "http://72.60.114.241/api/historial/envio";

const MAX_INPUT_LENGTH = 64;

const FETCH_NEW_MS = 8_000;
const FETCH_PRODUCTION_MS = 10_000;
const FETCH_HM_MS = 3_000;

export function normalizeTrackingOrigin(raw: string): string {
   const t = raw.trim();
   const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`;
   const u = new URL(withScheme);
   return u.origin;
}

function newTrackingLookupUrl(): string {
   const raw =
      process.env.TRACKING_NEW_URL?.trim() ||
      process.env.NEXT_PUBLIC_TRACKING_NEW_URL?.trim() ||
      DEFAULT_NEW_ORIGIN;
   const origin = normalizeTrackingOrigin(raw);
   return `${origin}/api/v1/tracking/lookup`;
}

function productionBaseUrl(): string {
   const raw = process.env.TRACKING_PRODUCTION_URL?.trim();
   if (raw) {
      return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
   }
   return DEFAULT_PRODUCTION_BASE;
}

export function hmHistorialBaseUrl(): string {
   return process.env.HM_HISTORIAL_API_URL?.trim() || DEFAULT_HM_HISTORIAL_BASE;
}

export function validateLookupInput(value: string | undefined | null): { ok: true; trimmed: string } | { ok: false } {
   if (value == null || typeof value !== "string") {
      return { ok: false };
   }
   const trimmed = value.trim();
   if (!trimmed || trimmed.length > MAX_INPUT_LENGTH) {
      return { ok: false };
   }
   const isOrderId = /^\d+$/.test(trimmed);
   if (!isOrderId && trimmed.length < 3) {
      return { ok: false };
   }
   return { ok: true, trimmed };
}

export function stripCteSuffix(id: string): string {
   if (id.endsWith("CTE") || id.endsWith("cte")) {
      return id.slice(0, -3).trim();
   }
   return id;
}

/** `api-key` for tracking.ctenvios.com — can differ from Bearer key for the new API. */
function productionApiKey(): string {
   return process.env.TRACKING_PRODUCTION_API_KEY?.trim() || API_KEY;
}

/**
 * Normalize production/new payloads so `enrichInvoiceWithHistorial` always sees `parcels[]`.
 */
export function normalizeTrackingPayloadForEnrich(data: unknown): unknown {
   if (data == null || typeof data !== "object") {
      return data;
   }
   if (Array.isArray(data)) {
      return data.length > 0 ? { parcels: data } : data;
   }
   const o = { ...(data as Record<string, unknown>) };

   if (Array.isArray(o.parcels) && o.parcels.length > 0) {
      return o;
   }

   const d = o.data;
   if (d != null && typeof d === "object" && !Array.isArray(d)) {
      const inner = d as Record<string, unknown>;
      if (Array.isArray(inner.parcels) && inner.parcels.length > 0) {
         const { data: _drop, ...rest } = o;
         return { ...rest, ...inner, parcels: inner.parcels };
      }
      if (Array.isArray(inner.items) && inner.items.length > 0) {
         const { data: _drop, ...rest } = o;
         return { ...rest, ...inner, parcels: inner.items };
      }
   }

   for (const k of ["items", "results"] as const) {
      const v = o[k];
      if (Array.isArray(v) && v.length > 0) {
         return { ...o, parcels: v };
      }
   }

   if (o.parcel != null && typeof o.parcel === "object") {
      return { ...o, parcels: [o.parcel] };
   }

   return o;
}

/** Returns normalized payload with `parcels`, or null if unusable. */
function prepareLookupPayload(data: unknown): unknown | null {
   if (data == null) {
      return null;
   }
   if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      const raw = data as Record<string, unknown>;
      if (typeof raw.message === "string" && raw.message.toLowerCase().includes("not found")) {
         return null;
      }
      if (typeof raw.error === "string") {
         const e = raw.error.toLowerCase();
         if (e.includes("not found") || e === "not_found") {
            return null;
         }
      }
   }

   const normalized = normalizeTrackingPayloadForEnrich(data);
   if (normalized == null || typeof normalized !== "object") {
      return null;
   }
   const parcels = (normalized as Record<string, unknown>).parcels;
   if (!Array.isArray(parcels) || parcels.length === 0) {
      return null;
   }
   return normalized;
}

/** True when lookup JSON has no usable `parcels` (after shape normalization). */
export function isNotFoundFromNewApi(data: unknown): boolean {
   return prepareLookupPayload(data) == null;
}

function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
   const controller = new AbortController();
   const t = setTimeout(() => controller.abort(), ms);
   return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(t));
}

export async function fetchFromNewTracking(trimmedId: string, isOrderId: boolean): Promise<unknown> {
   const params = new URLSearchParams(isOrderId ? { order_id: trimmedId } : { tracking: trimmedId });
   const url = `${newTrackingLookupUrl()}?${params.toString()}`;
   const headers = new Headers();
   headers.set("Accept", "application/json");
   const apiKey = process.env.TRACKING_API_KEY?.trim();
   if (apiKey) {
      headers.set("Authorization", `Bearer ${apiKey}`);
   }
   const res = await fetchWithTimeout(url, { method: "GET", headers, cache: "no-store" }, FETCH_NEW_MS);
   if (!res.ok) {
      throw new Error(`new_tracking_${res.status}`);
   }
   return res.json() as Promise<unknown>;
}

function productionInvoicePath(trimmedId: string): boolean {
   return trimmedId.length >= 4 && trimmedId.length < 7;
}

function buildProductionUrl(base: string, path: string): string {
   return `${base.replace(/\/$/, "")}/${path}`;
}

/**
 * Production API: 4–6 digit ids use `parcels/invoice/…` first (legacy rule).
 * Many numeric references exist only as HBL — on 404, retry the other path for digit-only ids.
 */
export async function fetchFromProduction(trimmedId: string): Promise<unknown> {
   const base = productionBaseUrl();
   const apiKey = productionApiKey();
   const headers = new Headers();
   headers.set("Accept", "application/json");
   if (apiKey) {
      headers.set("api-key", apiKey);
   }

   const primaryInvoice = productionInvoicePath(trimmedId);
   const primaryPath = primaryInvoice ? `parcels/invoice/${trimmedId}` : `parcels/hbl/${trimmedId}`;
   const altPath = primaryInvoice ? `parcels/hbl/${trimmedId}` : `parcels/invoice/${trimmedId}`;
   const digitOnly = /^\d+$/.test(trimmedId);

   const tryUrl = async (path: string): Promise<Response> =>
      fetchWithTimeout(buildProductionUrl(base, path), { method: "GET", headers, cache: "no-store" }, FETCH_PRODUCTION_MS);

   let res = await tryUrl(primaryPath);
   if (!res.ok && res.status === 404 && digitOnly) {
      res = await tryUrl(altPath);
   }

   if (!res.ok) {
      throw new Error(`production_${res.status}`);
   }
   return res.json() as Promise<unknown>;
}

function parcelHbl(p: Record<string, unknown>): string | null {
   for (const key of ["hbl", "HBL", "hblNumber", "tracking", "Tracking", "trackingNumber"]) {
      const v = p[key];
      if (typeof v === "string" && v.trim()) {
         return v.trim();
      }
   }
   return null;
}

/** Event arrays from new/production parcel payloads (field names vary by API). */
function parcelBaseEvents(rec: Record<string, unknown>): unknown[] {
   for (const key of ["events", "trackingEvents", "history", "statusHistory", "updates"]) {
      const v = rec[key];
      if (Array.isArray(v)) {
         return v;
      }
   }
   return [];
}

export async function fetchHmHistorialForHbl(hbl: string): Promise<unknown[] | null> {
   const base = hmHistorialBaseUrl().replace(/\/$/, "");
   const url = `${base}/${encodeURIComponent(hbl)}/`;
   try {
      const res = await fetchWithTimeout(url, { method: "GET", cache: "no-store" }, FETCH_HM_MS);
      if (!res.ok) {
         return null;
      }
      const data = (await res.json()) as { historial?: unknown };
      return Array.isArray(data.historial) ? data.historial : [];
   } catch {
      return null;
   }
}

/**
 * Attaches `historial` (array) to each parcel object when HM returns data.
 */
export async function enrichInvoiceWithHistorial(data: unknown): Promise<void> {
   if (data == null || typeof data !== "object") {
      return;
   }
   const root = data as Record<string, unknown>;
   const parcels = root.parcels;
   if (!Array.isArray(parcels) || parcels.length === 0) {
      return;
   }
   await Promise.all(
      parcels.map(async (p) => {
         if (p == null || typeof p !== "object") {
            return;
         }
         const rec = p as Record<string, unknown>;
         const hbl = parcelHbl(rec);
         if (!hbl) {
            return;
         }
         const historial = await fetchHmHistorialForHbl(hbl);
         if (historial != null) {
            rec.historial = historial;
         }
         const merged = mergeAndNormalizeEvents(parcelBaseEvents(rec), {
            historial: historial ?? [],
         });
         if (merged.length > 0) {
            rec.timeline = merged;
         }
      }),
   );
}

/**
 * 1) `fetchFromProduction` (`DEFAULT_PRODUCTION_BASE` / `TRACKING_PRODUCTION_URL`).
 * 2) If that throws or payload is empty / not found → `fetchFromNewTracking` (`DEFAULT_NEW_ORIGIN` / env).
 * Enrichment runs after a successful payload from either source.
 */
export async function runTrackingLookup(trimmedId: string, isOrderId: boolean): Promise<unknown> {
   let prodData: unknown;
   try {
      prodData = await fetchFromProduction(trimmedId);
   } catch {
      prodData = undefined;
   }

   const prodReady = prodData !== undefined ? prepareLookupPayload(prodData) : null;
   if (prodReady != null) {
      await enrichInvoiceWithHistorial(prodReady);
      return prodReady;
   }

   let newData: unknown;
   try {
      newData = await fetchFromNewTracking(trimmedId, isOrderId);
   } catch {
      newData = undefined;
   }

   const newReady = newData !== undefined ? prepareLookupPayload(newData) : null;
   if (newReady != null) {
      await enrichInvoiceWithHistorial(newReady);
      return newReady;
   }

   throw new Error("not_found");
}
