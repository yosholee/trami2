/**
 * Merges parcel events (new/base API) with HM historial into a normalized timeline.
 */

import type { TrackingTimelineEvent } from "@/lib/tracking-types";

const TYPO_CORRECTIONS = {
   Trasncargo: "Transcargo",
} as const;

function fixKnownTypos(text: string | null | undefined): string | null | undefined {
   if (text == null || text === "") {
      return text;
   }
   let corrected = text;
   for (const [typo, correction] of Object.entries(TYPO_CORRECTIONS)) {
      corrected = corrected.replace(new RegExp(typo, "gi"), correction);
   }
   return corrected;
}

const HM_STATUS_MAP = {
   entradarecibida: { code: "AT_WAREHOUSE", name: "Entrada en almacén" },
   transferenciaalmacen: { code: "WAREHOUSE_TRANSFER", name: "Transferencia entre almacenes" },
   despachomensajero: { code: "OUT_FOR_DELIVERY", name: "Despachado a mensajero" },
} as const;

type HmStatusKey = keyof typeof HM_STATUS_MAP;

function normalizeHmTipoKey(tipo: string | undefined): string {
   if (tipo == null || tipo === "") {
      return "";
   }
   return tipo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
}

function extractLocationFromDetalle(detalle: string | null | undefined): string | null {
   if (detalle == null || detalle === "") {
      return null;
   }
   const warehouseRegex = /almac[eé]n\s+([^\.]+)/i;
   const warehouseMatch = detalle.match(warehouseRegex);
   if (warehouseMatch?.[1]) {
      return warehouseMatch[1].trim();
   }
   const provinceRegex = /provincia\s+([^\.]+)/i;
   const provinceMatch = detalle.match(provinceRegex);
   if (provinceMatch?.[1]) {
      return provinceMatch[1].trim();
   }
   return null;
}

function safeToISOString(dateValue: string | Date | null | undefined): string | null {
   if (dateValue == null || dateValue === "") {
      return null;
   }
   const date = new Date(dateValue);
   if (Number.isNaN(date.getTime())) {
      return null;
   }
   return date.toISOString();
}

interface NewApiParcelEvent {
   /** Primary time field from current upstream API */
   timestamp?: string | Date | null;
   updatedAt?: string | Date | null;
   statusCode?: string | null;
   statusName?: string | null;
   statusDescription?: string | null;
   locationId?: number | string | null;
   location?: string | null;
   updateMethod?: string | null;
   userName?: string | null;
   source?: string | null;
}

function parseParcelLocationId(locIdRaw: number | string | null | undefined): number | null {
   if (locIdRaw === null || locIdRaw === undefined || locIdRaw === "") {
      return null;
   }
   const locationId = Number(locIdRaw);
   return typeof locationId === "number" && Number.isFinite(locationId) ? locationId : null;
}

function mapNewEventToTrackingEvent(ev: NewApiParcelEvent): TrackingTimelineEvent {
   const ts = safeToISOString(ev.timestamp ?? ev.updatedAt ?? undefined);
   const codeRaw =
      typeof ev.statusCode === "string" ? ev.statusCode.trim() : ev.statusCode != null ? String(ev.statusCode).trim() : "";

   /** Rich unified events (`timestamp` + `statusCode`) from upstream */
   if (codeRaw !== "") {
      const nameRaw =
         typeof ev.statusName === "string" ? ev.statusName.trim() : ev.statusName != null ? String(ev.statusName).trim() : "";
      const descRaw = ev.statusDescription;
      const statusDescription =
         descRaw == null || descRaw === ""
            ? null
            : typeof descRaw === "string"
               ? descRaw
               : String(descRaw);
      const locRaw = ev.location;
      const location =
         locRaw == null || locRaw === "" ? null : typeof locRaw === "string" ? locRaw.trim() || null : String(locRaw);
      const um = ev.updateMethod != null ? String(ev.updateMethod) : "SYSTEM";
      const umRaw = typeof ev.userName === "string" ? ev.userName.trim() : ev.userName != null ? String(ev.userName) : null;
      const userName = umRaw !== "" ? umRaw : null;
      const src = ev.source === "HM" ? "HM" : "NEW";

      return {
         timestamp: ts,
         statusCode: codeRaw,
         statusName: nameRaw !== "" ? nameRaw : codeRaw,
         statusDescription,
         location,
         locationId: parseParcelLocationId(ev.locationId),
         updateMethod: um,
         userName,
         source: src,
      };
   }

   /** Legacy: warehouse-style rows with `updatedAt` + `location` only */
   const locIdRaw = ev.locationId;
   const locationId = parseParcelLocationId(locIdRaw);
   const idPart =
      locIdRaw !== undefined && locIdRaw !== null && String(locIdRaw) !== "" ? String(locIdRaw) : "UNKNOWN";

   return {
      timestamp: ts,
      statusCode: `LOCATION_${idPart}`,
      statusName:
         typeof ev.location === "string" && ev.location.trim() !== ""
            ? ev.location.trim()
            : ev.location != null
               ? String(ev.location)
               : "Unknown",
      statusDescription: null,
      location: typeof ev.location === "string" ? ev.location : ev.location != null ? String(ev.location) : null,
      locationId: locationId ?? null,
      updateMethod: "SYSTEM",
      userName: null,
      source: "NEW",
   };
}

interface HmHistoryRow {
   evento?: string | null;
   detalle?: string | null;
   tipo?: string | null;
   fecha_objeto?: string | Date | null;
   fecha?: string | Date | null;
   usuario?: string | null;
}

function mapHmHistoryToTrackingEvent(hm: HmHistoryRow): TrackingTimelineEvent {
   const eventoRaw = fixKnownTypos((hm.evento ?? "").trim());
   const evento = eventoRaw ?? "";
   const detalle = fixKnownTypos(hm.detalle ?? "") ?? "";

   const tipoKey = normalizeHmTipoKey(hm.tipo ?? undefined);
   const mapped =
      tipoKey !== "" && tipoKey in HM_STATUS_MAP
         ? HM_STATUS_MAP[tipoKey as HmStatusKey]
         : {
              code: hm.tipo ? hm.tipo.toUpperCase() : "HM_EVENT",
              name: evento || "Evento HM",
           };

   let statusCfg: { code: string; name: string } = mapped;

   const eventoLower = evento.toLowerCase();
   const detalleLower = detalle.toLowerCase();
   const isEntregaExitosaByEvento = eventoLower === "entrega exitosa";
   const isEntregaExitosaByDetalle = detalleLower.includes("entrega confirmada");

   if (isEntregaExitosaByEvento || isEntregaExitosaByDetalle) {
      statusCfg = { code: "DELIVERED", name: "Entrega exitosa" };
   }

   const ts = safeToISOString(hm.fecha_objeto ?? hm.fecha ?? undefined);

   return {
      timestamp: ts,
      statusCode: statusCfg.code,
      statusName: statusCfg.name,
      statusDescription: detalle || null,
      location: extractLocationFromDetalle(detalle),
      locationId: null,
      updateMethod: "HM_HISTORY",
      userName: hm.usuario ?? null,
      source: "HM",
   };
}

function isDeliveryEvent(ev: TrackingTimelineEvent): boolean {
   const code = (ev.statusCode || "").toUpperCase();
   const name = (ev.statusName || "").trim().toLowerCase();
   return code === "DELIVERED" || name === "entrega exitosa" || name === "entregado";
}

function isNewApiParcelEvent(x: unknown): x is NewApiParcelEvent {
   return x != null && typeof x === "object";
}

function isHmHistoryRow(x: unknown): x is HmHistoryRow {
   return x != null && typeof x === "object";
}

/**
 * Merges and normalizes events from both APIs.
 */
export function mergeAndNormalizeEvents(
   baseEvents: unknown[] | null | undefined,
   hmHistoryRaw: unknown[] | { historial?: unknown[] } | null | undefined,
): TrackingTimelineEvent[] {
   const hmArray = Array.isArray(hmHistoryRaw)
      ? hmHistoryRaw
      : hmHistoryRaw != null && typeof hmHistoryRaw === "object" && Array.isArray(hmHistoryRaw.historial)
         ? hmHistoryRaw.historial
         : [];

   const newEvents = (baseEvents ?? [])
      .filter(isNewApiParcelEvent)
      .map((ev) => mapNewEventToTrackingEvent(ev));
   const hmEvents = (hmArray ?? []).filter(isHmHistoryRow).map((hm) => mapHmHistoryToTrackingEvent(hm));

   let merged: TrackingTimelineEvent[] = [...newEvents, ...hmEvents];

   merged.sort((a, b) => {
      const aLocId = a.locationId ?? Infinity;
      const bLocId = b.locationId ?? Infinity;
      const aIsFixed = aLocId <= 5;
      const bIsFixed = bLocId <= 5;

      if (aIsFixed && bIsFixed) {
         return aLocId - bLocId;
      }
      if (aIsFixed && !bIsFixed) {
         return -1;
      }
      if (!aIsFixed && bIsFixed) {
         return 1;
      }
      const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return aTime - bTime;
   });

   const deduped: TrackingTimelineEvent[] = [];
   const seen = new Set<string>();
   for (const ev of merged) {
      const key = `${ev.timestamp}|${ev.statusCode}|${ev.location ?? ""}`;
      if (!seen.has(key)) {
         seen.add(key);
         deduped.push(ev);
      }
   }
   merged = deduped;

   const deliveryEvents = merged.filter(isDeliveryEvent);
   if (deliveryEvents.length > 1) {
      const hmDelivery = deliveryEvents.find((ev) => ev.source === "HM");
      if (hmDelivery) {
         merged = merged.filter((ev) => !isDeliveryEvent(ev) || ev.source === "HM");
      }
   }

   let lastTerminalIndex = -1;
   merged.forEach((ev, idx) => {
      if (isDeliveryEvent(ev)) {
         lastTerminalIndex = idx;
      }
   });

   if (lastTerminalIndex >= 0) {
      merged = merged.slice(0, lastTerminalIndex + 1);
   }

   return merged;
}

const PARCEL_EVENT_KEYS = ["events", "trackingEvents", "history", "statusHistory", "updates"] as const;

/** Event arrays keyed on parcel objects (aligned with server lookup enrichment). */
export function eventsArrayFromParcel(parcel: Record<string, unknown>): unknown[] {
   for (const key of PARCEL_EVENT_KEYS) {
      const v = parcel[key];
      if (Array.isArray(v)) {
         return v;
      }
   }
   return [];
}

/** Normalize `parcel.events` (+ optional `parcel.historial`) when `parcel.timeline` is missing (e.g. direct API fetch). */
export function buildParcelTimeline(parcel: Record<string, unknown>): TrackingTimelineEvent[] {
   const historial = Array.isArray(parcel.historial) ? parcel.historial : [];
   return mergeAndNormalizeEvents(eventsArrayFromParcel(parcel), { historial });
}
