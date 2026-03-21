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
   updatedAt?: string | Date | null;
   locationId?: number | string | null;
   location?: string | null;
}

function mapNewEventToTrackingEvent(ev: NewApiParcelEvent): TrackingTimelineEvent {
   const locIdRaw = ev.locationId;
   const locationId =
      locIdRaw === null || locIdRaw === undefined || locIdRaw === ""
         ? null
         : Number(locIdRaw);
   const ts = safeToISOString(ev.updatedAt ?? undefined);
   const idPart =
      locIdRaw !== undefined && locIdRaw !== null && String(locIdRaw) !== "" ? String(locIdRaw) : "UNKNOWN";

   return {
      timestamp: ts,
      statusCode: `LOCATION_${idPart}`,
      statusName: ev.location ?? "Unknown",
      statusDescription: null,
      location: ev.location ?? null,
      locationId: typeof locationId === "number" && Number.isFinite(locationId) ? locationId : null,
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
