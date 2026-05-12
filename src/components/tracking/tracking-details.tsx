import { Check, FileText, MapPin, Package, Truck } from "lucide-react";
import type { ReactElement } from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { LandingMessages } from "@/i18n/types";
import { buildParcelTimeline } from "@/lib/tracking-event-merge";
import { timelineHtmlToPlain } from "@/lib/tracking-html-plain";
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

/** Left column: agency, invoice pill, route, hero HBL, category / meta (matches reference layout). */
function ParcelSummaryPanel({
   invoice,
   parcel,
   labels,
   parcelPosition,
}: {
   invoice: TrackingInvoice;
   parcel: TrackingParcel;
   labels: Pick<LandingMessages["tracking"], "fieldInvoice" | "fieldHbl" | "fieldDescription" | "fieldWeight" | "packageDetails">;
   parcelPosition: [number, number] | null;
}): ReactElement {
   const agency = scalarString(invoice.agency);
   const inv = scalarString(invoice.invoiceId ?? invoice.order_id);
   const prov = scalarString(invoice.province);
   const city = scalarString(invoice.city);
   const routeLine = [prov, city].filter(Boolean).join(" - ");
   const hbl = scalarString(parcel.hbl);
   const description = scalarString(parcel.description);
   const weight = scalarString(parcel.weight);
   const extras = parcelBodyWithoutHistorial(parcel);
   const hasExtras = Object.keys(extras).length > 0;

   return (
      <div className="flex min-w-0 flex-col gap-6 p-6 sm:p-8 lg:pr-10">
         {parcelPosition ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800 dark:text-[#facc15]">
               {labels.packageDetails}{" "}
               <span className="tabular-nums text-zinc-600 dark:text-zinc-400">({parcelPosition[0]} / {parcelPosition[1]})</span>
            </p>
         ) : null}

         <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-4">
               {agency ? (
                  <p className="text-lg font-bold uppercase leading-tight tracking-wide text-zinc-950 dark:text-white sm:text-xl">
                     {agency}
                  </p>
               ) : null}
               <div className="flex flex-wrap items-center gap-2">
                  {inv ? (
                     <span
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200/90 bg-white px-3 py-2 text-sm font-semibold tabular-nums text-zinc-900 shadow-sm dark:border-white/15 dark:bg-zinc-900/70 dark:text-zinc-50"
                        title={labels.fieldInvoice}
                     >
                        <FileText className="size-4 shrink-0 text-amber-600 dark:text-[#facc15]" aria-hidden />
                        <span>{inv}</span>
                     </span>
                  ) : null}
               </div>
               {routeLine ? (
                  <p className="max-w-lg text-[15px] font-medium leading-snug text-zinc-500 dark:text-zinc-400">{routeLine}</p>
               ) : null}
            </div>
         </div>

         {hbl ? (
            <div>
               <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{labels.fieldHbl}</p>
               <p className="mt-1.5 font-mono text-[1.375rem] font-bold leading-snug tracking-tight text-zinc-950 break-all dark:text-white sm:text-2xl">
                  {hbl}
               </p>
            </div>
         ) : null}

         {description || weight || hasExtras ? (
            <div className="space-y-2 border-t border-zinc-100 pt-6 dark:border-white/10">
               {description ? (
                  <p className="text-base font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">{description}</p>
               ) : null}
               {weight ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                     <span className="font-semibold text-zinc-600 dark:text-zinc-400">{labels.fieldWeight}:</span>{" "}
                     <span className="tabular-nums">{weight}</span>
                  </p>
               ) : null}
               {hasExtras ? (
                  <pre className="mt-4 max-h-36 overflow-auto rounded-lg border border-zinc-200/80 bg-zinc-950/[0.02] p-3 font-mono text-[11px] leading-relaxed text-zinc-700 dark:border-white/10 dark:bg-black/30 dark:text-zinc-300">
                     {JSON.stringify(extras, null, 2)}
                  </pre>
               ) : null}
            </div>
         ) : null}
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
      <div className="min-w-0 border-t border-zinc-100 bg-zinc-50/40 p-6 sm:border-t-0 sm:bg-transparent lg:border-l lg:border-zinc-100 lg:bg-zinc-50/25 xl:px-10 dark:border-white/10 dark:bg-zinc-900/35 dark:sm:bg-transparent dark:lg:bg-zinc-900/35">
         <div className="mb-10 flex items-center gap-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">{heading}</h3>
            <span className="h-px flex-1 bg-zinc-200 dark:bg-white/15" aria-hidden />
         </div>
         <div>
            <ul className="space-y-10">
               {sorted.map((ev, idx) => {
                  const terminal = isTerminalDelivery(ev);
                  const showTerminalBadge = terminal && idx === 0;
                  const key = `${ev.timestamp ?? "x"}-${ev.statusCode}-${idx}`;
                  const isLastStep = idx === sorted.length - 1;

                  return (
                     <li key={key} className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-x-5 gap-y-0">
                        <div className="relative flex w-full flex-col items-center justify-start pt-px">
                           {!isLastStep ? (
                              <span
                                 aria-hidden
                                 className="pointer-events-none absolute left-1/2 top-3 z-0 w-px -translate-x-1/2 bg-zinc-200 dark:bg-zinc-600"
                                 style={{ height: "calc(100% + 2.5rem)" }}
                              />
                           ) : null}
                           <span
                              className={cn(
                                 "relative z-[1] flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 bg-white shadow-sm dark:bg-zinc-950",
                                 terminal
                                    ? "border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
                                    : "border-[#eab308] text-[#ca8a04] dark:border-[#facc15] dark:text-[#fde047]",
                              )}
                              aria-hidden
                           >
                              {terminal ? <Truck className="size-3.5" strokeWidth={2.25} /> : <Check className="size-3.5" strokeWidth={2.75} />}
                           </span>
                        </div>
                        <div className="min-w-0 pb-1 pt-px">
                           {showTerminalBadge ? (
                              <p className="mb-1.5 inline-flex rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                                 {terminalLabel}
                              </p>
                           ) : null}
                           <p
                              className={cn(
                                 "text-[15px] font-semibold leading-snug text-zinc-950 dark:text-white",
                                 terminal && "text-emerald-900 dark:text-emerald-300",
                              )}
                           >
                              {ev.statusName}
                           </p>
                           {(() => {
                              const descRaw = ev.statusDescription;
                              if (descRaw == null || normalizeTimelineText(descRaw) === "") {
                                 return null;
                              }
                              const plain = timelineHtmlToPlain(descRaw);
                              if (
                                 plain === "" ||
                                 normalizeTimelineText(plain) === normalizeTimelineText(ev.statusName)
                              ) {
                                 return null;
                              }
                              return (
                                 <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    {plain}
                                 </p>
                              );
                           })()}
                           {ev.location && !isRedundantTimelineLocation(ev.statusName, ev.location) ? (
                              <p className="mt-2 flex items-start gap-1.5 text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                                 <MapPin className="mt-0.5 size-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden />
                                 <span>{ev.location}</span>
                              </p>
                           ) : null}
                           <p className="mt-2.5 text-sm font-semibold tabular-nums tracking-wide text-amber-800 dark:text-[#facc15]">
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

function historialLine(entry: unknown): string {
   if (entry != null && typeof entry === "object") {
      const o = entry as Record<string, unknown>;
      for (const key of ["status", "estado", "description", "descripcion", "message", "mensaje"]) {
         const v = o[key];
         if (typeof v === "string" && v.trim()) {
            return timelineHtmlToPlain(v.trim());
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
         <Card className="mt-8 overflow-hidden border-zinc-200/90 bg-gradient-to-b from-white to-zinc-50 shadow-lg shadow-zinc-900/[0.08] ring-1 ring-zinc-950/[0.04] dark:border-white/10 dark:from-zinc-950 dark:to-zinc-900/95 dark:shadow-black/35 dark:ring-white/[0.06]">
            <CardContent className="px-6 py-8 sm:px-8">
               <pre className="max-h-64 overflow-auto rounded-xl border border-zinc-200/80 bg-zinc-950/[0.02] p-4 font-mono text-xs leading-relaxed text-zinc-700 dark:border-white/10 dark:bg-black/35 dark:text-zinc-300">
                  <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-800 dark:text-[#facc15]">
                     {labels.rawJson}
                  </span>
                  {JSON.stringify(invoice, null, 2)}
               </pre>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="mt-8 gap-0 overflow-hidden rounded-3xl border border-zinc-200/90 bg-white py-0 shadow-md shadow-zinc-900/[0.06] ring-0 dark:border-white/12 dark:bg-zinc-950 dark:shadow-black/35">
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
                     <div className="flex items-center gap-4 border-b border-zinc-200/85 bg-zinc-50/85 px-5 py-3.5 dark:border-white/10 dark:bg-zinc-900/55 sm:px-8">
                        <Package className="size-4 shrink-0 text-amber-700 dark:text-[#facc15]" aria-hidden />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-900/90 dark:text-[#fde047]/90">
                           {labels.parcelsHeading}
                        </p>
                        <span className="hidden h-px flex-1 bg-gradient-to-r from-amber-300/50 to-transparent sm:block dark:from-[#facc15]/35" aria-hidden />
                     </div>
                  ) : null}
                  <ul>
                     {parcels.map((p, i) => {
                        const parcelKey = `${scalarString(p.hbl) ?? (p.id != null ? String(p.id) : "parcel")}-${i}`;
                        const displayTimeline: TrackingTimelineEvent[] =
                           Array.isArray(p.timeline) && p.timeline.length > 0 ? p.timeline : buildParcelTimeline(p as Record<string, unknown>);
                        const hasTimeline = displayTimeline.length > 0;
                        const hasHistorial = Array.isArray(p.historial) && p.historial.length > 0;
                        const parcelPosition: [number, number] | null = parcels.length > 1 ? [i + 1, parcels.length] : null;
                        const twoColumns = hasTimeline || hasHistorial;

                        return (
                           <li key={parcelKey} className="border-b border-zinc-100 last:border-b-0 dark:border-white/10">
                              <div className={cn("grid gap-0", twoColumns && "lg:grid-cols-[2fr_minmax(0,3fr)]")}>
                                 <ParcelSummaryPanel
                                    invoice={invoice}
                                    parcel={p}
                                    labels={labels}
                                    parcelPosition={parcelPosition}
                                 />

                                 {hasTimeline ? (
                                    <VerticalTimeline
                                       events={displayTimeline}
                                       heading={labels.timelineHeading}
                                       terminalLabel={labels.terminalEvent}
                                    />
                                 ) : hasHistorial ? (
                                    <div className="min-w-0 border-t border-zinc-100 bg-zinc-50/40 px-6 py-8 sm:border-t-0 sm:bg-transparent lg:border-l lg:border-zinc-100 lg:bg-zinc-50/25 xl:px-10 dark:border-white/10 dark:bg-zinc-900/35 dark:sm:bg-transparent dark:lg:bg-zinc-900/35">
                                       <div className="mb-8 flex items-center gap-3">
                                          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                                             {labels.historialHeading}
                                          </h4>
                                          <span className="h-px flex-1 bg-zinc-200 dark:bg-white/15" aria-hidden />
                                       </div>
                                       <ul className="relative space-y-6 pl-0">
                                          {p.historial?.map((ev, j) => (
                                             <li key={`${i}-h-${j}`} className="flex gap-3 text-sm leading-relaxed">
                                                <span
                                                   className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border border-[#eab308] bg-[#fef9c3]/40 text-[#ca8a04] dark:border-[#facc15] dark:bg-[#facc15]/10 dark:text-[#fde047]"
                                                   aria-hidden
                                                >
                                                   <Check className="size-3" strokeWidth={2.5} />
                                                </span>
                                                <span className="min-w-0 pt-0.5 text-zinc-800 dark:text-zinc-200">
                                                   {historialLine(ev)}
                                                </span>
                                             </li>
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
