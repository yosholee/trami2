import { Check, FileText, MapPin, Truck } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LandingMessages } from "@/i18n/types";
import { buildParcelTimeline } from "@/lib/tracking-event-merge";
import type { TrackingInvoice, TrackingParcel, TrackingTimelineEvent } from "@/lib/tracking-types";
import { cn } from "@/lib/utils";

type TrackingFieldLabels = Pick<
   LandingMessages["tracking"],
   | "fieldInvoice"
   | "fieldAgency"
   | "fieldProvince"
   | "fieldCity"
   | "fieldHbl"
   | "fieldDescription"
   | "fieldWeight"
   | "parcelsHeading"
   | "packageDetails"
   | "historialHeading"
   | "timelineHeading"
   | "terminalEvent"
   | "rawJson"
>;

function scalarString(v: unknown): string | null {
   if (v === undefined || v === null) {
      return null;
   }
   if (typeof v === "string" && v.trim()) {
      return v.trim();
   }
   if (typeof v === "number" && Number.isFinite(v)) {
      return String(v);
   }
   return null;
}

function parcelBodyWithoutHistorial(p: TrackingParcel): Record<string, unknown> {
   const {
      historial: _h,
      timeline: _t,
      events: _e,
      hbl: _hbl,
      description: _desc,
      weight: _w,
      status: _st,
      status_message: _sm,
      ...rest
   } = p;
   return rest;
}

function formatTimelineTimestamp(iso: string | null): string {
   if (iso == null || iso === "") {
      return "—";
   }
   const d = new Date(iso);
   if (Number.isNaN(d.getTime())) {
      return iso;
   }
   return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** Strip tags for timeline copy; preserves `<br>` as line breaks. */
function timelineDescriptionPlain(html: string): string {
   const withBreaks = html.replace(/<br\s*\/?>/gi, "\n");
   const stripped = withBreaks.replace(/<[^>]*>/g, "");
   return stripped.replace(/\u00a0/g, " ").trim();
}

function isTerminalDelivery(ev: TrackingTimelineEvent): boolean {
   const code = (ev.statusCode || "").toUpperCase();
   const name = (ev.statusName || "").trim().toLowerCase();
   return code === "DELIVERED" || name === "entrega exitosa" || name === "entregado";
}

function sortTimelineNewestFirst(events: TrackingTimelineEvent[]): TrackingTimelineEvent[] {
   return [...events].sort((a, b) => {
      const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return tb - ta;
   });
}

/** Collapse whitespace, lowercase, trim; strip trailing periods for comparison. */
function normalizeTimelineText(s: string): string {
   return s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\.+$/g, "");
}

/** True when `location` repeats the same wording as the title (HM/API often duplicate). */
function isRedundantTimelineLocation(statusName: string, location: string | null | undefined): boolean {
   if (location == null || location.trim() === "") {
      return true;
   }
   const a = normalizeTimelineText(statusName);
   const b = normalizeTimelineText(location);
   if (a === b) {
      return true;
   }
   if (a.length === 0 || b.length === 0) {
      return false;
   }
   if (a.includes(b) || b.includes(a)) {
      const shorter = a.length <= b.length ? a : b;
      const longer = a.length > b.length ? a : b;
      if (shorter.length >= 8 && longer.startsWith(shorter)) {
         return true;
      }
   }
   return false;
}

function DetailRow({ label, children }: { label: string; children: ReactNode }): ReactElement {
   return (
      <div className="grid grid-cols-1 gap-1 border-b border-zinc-200/90 py-4 last:border-b-0 dark:border-white/8 sm:grid-cols-[minmax(0,10rem)_1fr] sm:items-start sm:gap-8">
         <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{label}</dt>
         <dd className="min-w-0 text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100">{children}</dd>
      </div>
   );
}

function VerticalTimeline({
   events,
   heading,
   terminalLabel,
}: {
   events: TrackingTimelineEvent[];
   heading: string;
   terminalLabel: string;
}): ReactElement {
   const sorted = sortTimelineNewestFirst(events);

   return (
      <div className="min-w-0">
         <h3 className="border-b border-zinc-200/90 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-white/8 dark:text-zinc-400">
            {heading}
         </h3>
         <div className="relative mt-8">
            {/* Line through horizontal center of w-5 (20px) gutter; dots are centered in that column */}
            <div
               className="pointer-events-none absolute bottom-4 left-[10px] top-4 w-px -translate-x-1/2 bg-zinc-300 dark:bg-zinc-600"
               aria-hidden
            />
            <ul className="relative">
               {sorted.map((ev, idx) => {
                  const terminal = isTerminalDelivery(ev);
                  const showTerminalBadge = terminal && idx === 0;
                  const key = `${ev.timestamp ?? "x"}-${ev.statusCode}-${idx}`;

                  return (
                     <li key={key} className="flex gap-3.5 pb-10 last:pb-3 sm:gap-4">
                        <div className="relative z-10 flex w-5 shrink-0 justify-center pt-1" aria-hidden>
                           <div
                              className={cn(
                                 "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white",
                                 terminal
                                    ? "bg-emerald-500 dark:bg-emerald-500"
                                    : "bg-sky-500 dark:bg-sky-500",
                              )}
                           >
                              {terminal ? (
                                 <Truck className="h-2.5 w-2.5" strokeWidth={2.5} />
                              ) : (
                                 <Check className="h-2.5 w-2.5" strokeWidth={3} />
                              )}
                           </div>
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                           {showTerminalBadge ? (
                              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
                                 {terminalLabel}
                              </p>
                           ) : null}
                           <p
                              className={cn(
                                 "text-[15px] font-semibold leading-snug tracking-tight",
                                 terminal ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-950 dark:text-white",
                              )}
                           >
                              {ev.statusName}
                           </p>
                           {(() => {
                              const descRaw = ev.statusDescription;
                              if (descRaw == null || normalizeTimelineText(descRaw) === "") {
                                 return null;
                              }
                              const plain = timelineDescriptionPlain(descRaw);
                              if (plain === "" || normalizeTimelineText(plain) === normalizeTimelineText(ev.statusName)) {
                                 return null;
                              }
                              return (
                                 <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                    {plain}
                                 </p>
                              );
                           })()}
                           {ev.location && !isRedundantTimelineLocation(ev.statusName, ev.location) ? (
                              <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">{ev.location}</p>
                           ) : null}
                           <p className="mt-1 text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                              {formatTimelineTimestamp(ev.timestamp)}
                           </p>
                        </div>
                     </li>
                  );
               })}
            </ul>
         </div>
      </div>
   );
}

function ShipmentSummaryHeader({
   invoice,
   labels,
}: {
   invoice: TrackingInvoice;
   labels: Pick<LandingMessages["tracking"], "fieldInvoice" | "fieldAgency" | "fieldProvince" | "fieldCity">;
}): ReactElement | null {
   const agency = scalarString(invoice.agency);
   const inv = scalarString(invoice.invoiceId ?? invoice.order_id);
   const prov = scalarString(invoice.province);
   const city = scalarString(invoice.city);
   const locationLine = [prov, city].filter(Boolean).join(" — ");

   if (!agency && !inv && !locationLine) {
      return null;
   }

   const metaCardClass =
      "flex gap-4 rounded-lg border border-zinc-200/90 bg-white/80 p-4 dark:border-white/8 dark:bg-zinc-950/40";
   const iconWrapClass =
      "flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-500/12 text-amber-700 dark:bg-amber-400/15 dark:text-amber-400";

   return (
      <div className="space-y-6">
         {agency ? (
            <div>
               <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{labels.fieldAgency}</p>
               <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-[1.75rem]">{agency}</h2>
            </div>
         ) : null}
         <div className="grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
            {inv ? (
               <div className={metaCardClass}>
                  <div className={iconWrapClass} aria-hidden>
                     <FileText className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                     <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{labels.fieldInvoice}</p>
                     <p className="mt-1 text-xl font-semibold tabular-nums text-zinc-950 dark:text-white">{inv}</p>
                  </div>
               </div>
            ) : null}
            {locationLine ? (
               <div className={metaCardClass}>
                  <div className={iconWrapClass} aria-hidden>
                     <MapPin className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                     <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                        {labels.fieldProvince} / {labels.fieldCity}
                     </p>
                     <p className="mt-1 text-base font-medium leading-snug text-zinc-900 dark:text-zinc-100">{locationLine}</p>
                  </div>
               </div>
            ) : null}
         </div>
      </div>
   );
}

function historialLine(entry: unknown): string {
   if (entry != null && typeof entry === "object") {
      const o = entry as Record<string, unknown>;
      for (const key of ["status", "estado", "description", "descripcion", "message", "mensaje"]) {
         const v = o[key];
         if (typeof v === "string" && v.trim()) {
            return v.trim();
         }
      }
   }
   return typeof entry === "string" ? entry : JSON.stringify(entry);
}

function Row({ label, value }: { label: string; value: string }): ReactElement {
   return (
      <div className="flex flex-col gap-1 border-b border-zinc-200 py-3 text-left last:border-b-0 dark:border-white/15 sm:flex-row sm:items-baseline sm:gap-4">
         <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">{label}</span>
         <span className="min-w-0 text-base font-medium text-zinc-950 dark:text-white">{value}</span>
      </div>
   );
}

export function TrackingDetails({
   invoice,
   labels,
}: {
   invoice: TrackingInvoice;
   labels: TrackingFieldLabels;
}): ReactElement {
   const rows: { label: string; value: string }[] = [];
   const pick = (key: keyof TrackingInvoice, label: string): void => {
      const v = invoice[key];
      if (v !== undefined && v !== null && typeof v !== "object") {
         rows.push({ label, value: String(v) });
      }
   };
   pick("invoiceId", labels.fieldInvoice);
   const hasInvoiceRow = rows.some((r) => r.label === labels.fieldInvoice);
   if (!hasInvoiceRow) {
      const oid = scalarString(invoice.order_id);
      if (oid) {
         rows.push({ label: labels.fieldInvoice, value: oid });
      }
   }
   pick("agency", labels.fieldAgency);
   pick("province", labels.fieldProvince);
   pick("city", labels.fieldCity);

   const parcels = Array.isArray(invoice.parcels) ? invoice.parcels : [];
   const hasParcels = parcels.length > 0;

   if (!hasParcels && rows.length === 0 && parcels.length === 0) {
      return (
         <Card className="mt-8 border-zinc-200 shadow-md dark:border-white/10 dark:bg-zinc-950">
            <CardContent className="pt-6">
               <pre className="max-h-64 overflow-auto text-xs text-zinc-700 dark:text-zinc-300">
                  <span className="mb-2 block text-[10px] font-semibold uppercase text-zinc-500">{labels.rawJson}</span>
                  {JSON.stringify(invoice, null, 2)}
               </pre>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="mt-8 gap-0 overflow-hidden border-zinc-200 border-l-[3px] border-l-amber-500 py-0 shadow-lg dark:border-white/12 dark:border-l-[#facc15] dark:bg-zinc-950 dark:shadow-black/40">
         {hasParcels ? (
            <CardHeader className="border-b border-zinc-200/90 bg-zinc-50/90 px-5 py-6 sm:px-8 sm:py-8 dark:border-white/8 dark:bg-zinc-900/35">
               <ShipmentSummaryHeader invoice={invoice} labels={labels} />
            </CardHeader>
         ) : null}

         <CardContent className="px-0 pb-0 pt-0">
            {!hasParcels && rows.length > 0 ? (
               <div className="divide-y divide-zinc-200/80 px-5 py-2 dark:divide-white/10 sm:px-8">
                  {rows.map((r) => (
                     <Row key={r.label} label={r.label} value={r.value} />
                  ))}
               </div>
            ) : null}

            {hasParcels ? (
               <div>
                  {parcels.length > 1 ? (
                     <p className="border-b border-zinc-200/90 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-white/8 dark:text-zinc-400 sm:px-8">
                        {labels.parcelsHeading}
                     </p>
                  ) : null}
                  <ul>
                     {parcels.map((p, i) => {
                        const hbl = scalarString(p.hbl);
                        const description = scalarString(p.description);
                        const weight = scalarString(p.weight);
                        const extras = parcelBodyWithoutHistorial(p);
                        const hasExtras = Object.keys(extras).length > 0;
                        const parcelKey = `${hbl ?? (p.id != null ? String(p.id) : "parcel")}-${i}`;
                        const displayTimeline: TrackingTimelineEvent[] =
                           Array.isArray(p.timeline) && p.timeline.length > 0 ? p.timeline : buildParcelTimeline(p as Record<string, unknown>);
                        const hasTimeline = displayTimeline.length > 0;

                        return (
                           <li key={parcelKey} className="border-b border-zinc-200/90 last:border-b-0 dark:border-white/8">
                              <div
                                 className={cn(
                                    "grid items-stretch",
                                    hasTimeline
                                       ? "lg:grid-cols-[minmax(0,1fr)_minmax(320px,42%)] xl:grid-cols-[minmax(0,1fr)_minmax(360px,40%)]"
                                       : "",
                                 )}
                              >
                                 <div className="min-w-0 border-b border-zinc-200/90 px-5 py-6 sm:px-8 sm:py-8 dark:border-white/8 lg:border-b-0 lg:border-r">
                                    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                                       {labels.packageDetails}
                                    </p>
                                    <dl>
                                       {hbl ? (
                                          <DetailRow label={labels.fieldHbl}>
                                             <span className="break-all font-mono text-[14px] font-medium tracking-tight">{hbl}</span>
                                          </DetailRow>
                                       ) : null}
                                       {description ? <DetailRow label={labels.fieldDescription}>{description}</DetailRow> : null}
                                       {weight ? (
                                          <DetailRow label={labels.fieldWeight}>
                                             <span className="font-medium tabular-nums">{weight}</span>
                                          </DetailRow>
                                       ) : null}
                                    </dl>

                                    {hasExtras ? (
                                       <pre className="mt-6 max-h-36 overflow-auto rounded-lg border border-zinc-200/80 bg-zinc-100/60 p-4 font-mono text-[11px] text-zinc-700 dark:border-white/8 dark:bg-black/40 dark:text-zinc-300">
                                          {JSON.stringify(extras, null, 2)}
                                       </pre>
                                    ) : null}
                                 </div>

                                 {hasTimeline ? (
                                    <div className="min-w-0 bg-zinc-50/70 px-5 py-6 sm:px-8 sm:py-8 dark:bg-zinc-900/45">
                                       <VerticalTimeline
                                          events={displayTimeline}
                                          heading={labels.timelineHeading}
                                          terminalLabel={labels.terminalEvent}
                                       />
                                    </div>
                                 ) : Array.isArray(p.historial) && p.historial.length > 0 ? (
                                    <div className="min-w-0 bg-zinc-50/70 px-5 py-6 sm:px-8 sm:py-8 dark:bg-zinc-900/45 lg:border-l lg:border-zinc-200/90 dark:lg:border-white/8">
                                       <h4 className="border-b border-zinc-200/90 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-white/8 dark:text-zinc-400">
                                          {labels.historialHeading}
                                       </h4>
                                       <ul className="mt-5 list-inside list-disc space-y-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                                          {p.historial.map((ev, j) => (
                                             <li key={`${i}-h-${j}`}>{historialLine(ev)}</li>
                                          ))}
                                       </ul>
                                    </div>
                                 ) : null}
                              </div>
                           </li>
                        );
                     })}
                  </ul>
               </div>
            ) : null}
         </CardContent>
      </Card>
   );
}
