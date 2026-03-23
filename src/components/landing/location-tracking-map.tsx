"use client";

import { type ReactElement, useEffect, useRef, useState } from "react";
import MapLibreGL from "maplibre-gl";
import { Home, Package, Ship, Truck } from "lucide-react";

import {
   Map,
   MapMarker,
   MapRoute,
   MarkerContent,
   MarkerLabel,
   MarkerTooltip,
   useMap,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";

export interface LocationTrackingMapLabels {
   originHub: string;
   havana: string;
   santiago: string;
   shipEnRoute: string;
   groundLeg: string;
   deliveryBadge: string;
   provinces: {
      pinarDelRio: string;
      artemisa: string;
      matanzas: string;
      villaClara: string;
      camaguey: string;
      holguin: string;
      granma: string;
      guantanamo: string;
   };
}

/** Bradenton area — represents Sarasota, Bradenton & Tampa Gulf Coast pickups. */
const FL_GULF_ORIGIN: [number, number] = [-82.575, 27.499];
const HAVANA_PORT: [number, number] = [-82.292, 23.168];
const HAVANA_DELIVERY: [number, number] = [-82.3666, 23.1136];
const SANTIAGO_DELIVERY: [number, number] = [-75.8301, 20.0247];
const GREEN_DASH: [number, number] = [2, 2];

const SEA_ROUTE: [number, number][] = [
   FL_GULF_ORIGIN,
   [-82.45, 26.85],
   [-82.25, 26.1],
   [-82.05, 25.35],
   [-81.75, 24.75],
   [-82.02, 23.85],
   [-82.22, 23.48],
   HAVANA_PORT,
];

const OVERLAND_HAVANA_SANTIAGO: [number, number][] = [
   HAVANA_DELIVERY,
   [-82.08, 22.98],
   [-81.15, 22.72],
   [-80.25, 22.45],
   [-79.2, 22.12],
   [-78.15, 21.78],
   [-77.2, 21.38],
   [-76.55, 21.02],
   [-76.05, 20.62],
   [-75.95, 20.32],
   SANTIAGO_DELIVERY,
];

const ALL_GREEN_ROUTES: [number, number][][] = [OVERLAND_HAVANA_SANTIAGO];

const SHIP_AT_SEA: [number, number] = [-81.42, 24.52];
const OVERLAND_ROUTE_DURATION_MS = 22_000;

function segmentLength(a: [number, number], b: [number, number]): number {
   const dx = b[0] - a[0];
   const dy = b[1] - a[1];
   return Math.hypot(dx, dy);
}

function pointAlongRoute(coords: [number, number][], t: number): [number, number] {
   if (coords.length < 2) {
      return coords[0] ?? [0, 0];
   }
   const tClamped = Math.min(1, Math.max(0, t));
   const lengths: number[] = [];
   let total = 0;
   for (let i = 0; i < coords.length - 1; i++) {
      const L = segmentLength(coords[i], coords[i + 1]);
      lengths.push(L);
      total += L;
   }
   if (total === 0) {
      return coords[0];
   }
   let target = tClamped * total;
   for (let i = 0; i < lengths.length; i++) {
      const L = lengths[i];
      if (target <= L) {
         const u = L === 0 ? 0 : target / L;
         const from = coords[i];
         const to = coords[i + 1];
         return [
            from[0] + (to[0] - from[0]) * u,
            from[1] + (to[1] - from[1]) * u,
         ];
      }
      target -= L;
   }
   return coords[coords.length - 1];
}

function easeInOutSine(x: number): number {
   return -(Math.cos(Math.PI * x) - 1) / 2;
}

/** Initial (forward) bearing in degrees, 0° = north, 90° = east. `a`/`b` are [lng, lat]. */
function initialBearingDeg(a: [number, number], b: [number, number]): number {
   const [lng1, lat1] = a;
   const [lng2, lat2] = b;
   const φ1 = (lat1 * Math.PI) / 180;
   const φ2 = (lat2 * Math.PI) / 180;
   const Δλ = ((lng2 - lng1) * Math.PI) / 180;
   const y = Math.sin(Δλ) * Math.cos(φ2);
   const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
   return (Math.atan2(y, x) * 180) / Math.PI;
}

const ROUTE_T_EPS = 0.018;

/** Min pixel delta between projected points to trust screen-space heading. */
const TRUCK_SCREEN_DELTA_PX = 0.2;

/** Slightly larger than `ROUTE_T_EPS` so Mercator chord spans enough pixels at landing zoom. */
const TRUCK_SCREEN_PATH_EPS = 0.045;

/**
 * CSS `rotate()` for a glyph that points **+X (east)** in its SVG.
 * Uses two polyline samples whose chord matches **time direction** (ida / vuelta), then
 * `project` → avoids frame-to-frame desync that can flip the truck on the return leg.
 */
function truckScreenRotationFromTimedPath(
   map: MapLibreGL.Map,
   coords: [number, number][],
   t: number,
   outboundLeg: boolean
): number | null {
   const δ = TRUCK_SCREEN_PATH_EPS;
   const pAt = (u: number): [number, number] => pointAlongRoute(coords, u);
   let from: [number, number];
   let to: [number, number];

   if (outboundLeg) {
      if (t < 1 - 1e-9) {
         from = pAt(t);
         to = pAt(Math.min(1, t + δ));
      } else {
         from = pAt(Math.max(0, t - δ));
         to = pAt(t);
      }
   } else if (t > 1e-9) {
      from = pAt(t);
      to = pAt(Math.max(0, t - δ));
   } else {
      from = pAt(Math.min(1, t + δ));
      to = pAt(t);
   }

   const a = map.project(from);
   const b = map.project(to);
   const dx = b.x - a.x;
   const dy = b.y - a.y;
   if (Math.abs(dx) + Math.abs(dy) < TRUCK_SCREEN_DELTA_PX) {
      return null;
   }
   return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/** Geographic bearing → CSS rotate when screen delta is too small (east-facing glyph). */
function truckRotationDegFromGeoBearing(bearingDeg: number): number {
   return bearingDeg - 90;
}

/** Bearing matches motion: outbound = toward +t (Havana→Santiago), inbound = toward −t. */
function bearingForRoutePhase(
   coords: [number, number][],
   t: number,
   outboundLeg: boolean
): number {
   const pAt = (u: number): [number, number] => pointAlongRoute(coords, u);
   const p = pAt(t);

   if (outboundLeg) {
      if (t < 1 - 1e-9) {
         return initialBearingDeg(p, pAt(Math.min(1, t + ROUTE_T_EPS)));
      }
      return initialBearingDeg(pAt(Math.max(0, t - ROUTE_T_EPS)), p);
   }
   if (t > 1e-9) {
      return initialBearingDeg(p, pAt(Math.max(0, t - ROUTE_T_EPS)));
   }
   return initialBearingDeg(pAt(Math.min(1, ROUTE_T_EPS)), p);
}

function CircleMarker({
   bgClass,
   children,
   className,
}: {
   bgClass: string;
   children: React.ReactNode;
   className?: string;
}): ReactElement {
   return (
      <div
         className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-md",
            bgClass,
            className
         )}
      >
         {children}
      </div>
   );
}

function useAnimatedPointOnRoute(
   coords: [number, number][],
   durationMs: number,
   enabled: boolean,
   map: MapLibreGL.Map | null,
   mapReady: boolean
): { lng: number; lat: number; truckRotationDeg: number } {
   const [lngLat, setLngLat] = useState<[number, number]>(() => pointAlongRoute(coords, 0));
   const [truckRotationDeg, setTruckRotationDeg] = useState(0);

   useEffect(() => {
      if (!enabled) {
         const t = 0.4;
         const p = pointAlongRoute(coords, t);
         setLngLat(p);
         setTruckRotationDeg(
            truckRotationDegFromGeoBearing(bearingForRoutePhase(coords, t, true))
         );
         return;
      }

      let frame = 0;
      const start = performance.now();

      const tick = (now: number): void => {
         const cycle = durationMs * 2;
         const elapsed = (now - start) % cycle;
         const outboundLeg = elapsed < durationMs;
         const raw = outboundLeg ? elapsed / durationMs : 2 - elapsed / durationMs;
         const t = easeInOutSine(raw);
         const p = pointAlongRoute(coords, t);
         setLngLat(p);

         let rotationDeg: number;
         if (map && mapReady) {
            const screenDeg = truckScreenRotationFromTimedPath(map, coords, t, outboundLeg);
            if (screenDeg !== null) {
               rotationDeg = screenDeg;
            } else {
               rotationDeg = truckRotationDegFromGeoBearing(
                  bearingForRoutePhase(coords, t, outboundLeg)
               );
            }
         } else {
            rotationDeg = truckRotationDegFromGeoBearing(
               bearingForRoutePhase(coords, t, outboundLeg)
            );
         }
         setTruckRotationDeg(rotationDeg);

         frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
   }, [coords, durationMs, enabled, map, mapReady]);

   return { lng: lngLat[0], lat: lngLat[1], truckRotationDeg };
}

function AnimatedGroundTruckMarker({ groundLeg }: { groundLeg: string }): ReactElement {
   const { map, isLoaded } = useMap();
   const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

   useEffect(() => {
      setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
   }, []);

   const { lng, lat, truckRotationDeg } = useAnimatedPointOnRoute(
      OVERLAND_HAVANA_SANTIAGO,
      OVERLAND_ROUTE_DURATION_MS,
      reduceMotion === false,
      map,
      isLoaded
   );

   return (
      <MapMarker
         latitude={lat}
         longitude={lng}
         pitchAlignment="viewport"
         rotationAlignment="viewport"
      >
         <MarkerContent className="flex flex-col items-center">
            <div
               className="origin-center will-change-transform"
               style={{
                  transform: `rotate(${truckRotationDeg}deg)`,
               }}
            >
               <Truck
                  aria-hidden
                  className="size-[18px] text-[#bbf7d0] drop-shadow-[0_0_4px_rgba(0,0,0,0.95),0_1px_2px_rgba(0,0,0,0.85)] sm:size-5"
                  strokeWidth={2.5}
               />
            </div>
            <MarkerLabel
               className="mt-0.5 rounded bg-black/75 px-1 py-0.5 text-[8px] font-medium text-white"
               position="bottom"
            >
               {groundLeg}
            </MarkerLabel>
            <MarkerTooltip>
               <span className="text-white">{groundLeg}</span>
            </MarkerTooltip>
         </MarkerContent>
      </MapMarker>
   );
}

const PROVINCE_PINS: {
   id: keyof LocationTrackingMapLabels["provinces"];
   lng: number;
   lat: number;
   /** Fill for dot + ping (distinct per province). */
   color: string;
}[] = [
   { id: "pinarDelRio", lng: -83.696, lat: 22.412, color: "#2dd4bf" },
   { id: "artemisa", lng: -82.756, lat: 22.813, color: "#38bdf8" },
   { id: "matanzas", lng: -81.575, lat: 23.051, color: "#4ade80" },
   { id: "villaClara", lng: -79.967, lat: 22.407, color: "#fbbf24" },
   { id: "camaguey", lng: -77.918, lat: 21.378, color: "#fb7185" },
   { id: "holguin", lng: -76.263, lat: 20.887, color: "#c084fc" },
   { id: "granma", lng: -76.643, lat: 20.374, color: "#fb923c" },
   { id: "guantanamo", lng: -75.214, lat: 20.144, color: "#e879f9" },
];

const PROVINCE_PIN_CYCLE_SEC = 2.6;
const PROVINCE_PIN_STAGGER_SEC = 0.32;

function AnimatedProvincePin({
   colorHex,
   staggerIndex,
}: {
   colorHex: string;
   staggerIndex: number;
}): ReactElement {
   const delaySec = staggerIndex * PROVINCE_PIN_STAGGER_SEC;
   const style = {
      backgroundColor: colorHex,
      animationDelay: `${delaySec}s`,
      animationDuration: `${PROVINCE_PIN_CYCLE_SEC}s`,
   };

   return (
      <div
         className="province-pin-root relative flex size-[18px] items-center justify-center"
         aria-hidden
      >
         <div className="province-pin-ping pointer-events-none absolute size-2 rounded-full" style={style} />
         <div
            className="province-pin-dot pointer-events-none relative z-[1] size-2 rounded-full border-2 border-white/95 shadow-[0_1px_4px_rgba(0,0,0,0.65)]"
            style={style}
         />
      </div>
   );
}

function FitRouteViewport(): null {
   const { map, isLoaded } = useMap();
   const didFitRef = useRef(false);

   useEffect(() => {
      if (!isLoaded || !map || didFitRef.current) {
         return;
      }

      const bounds = new MapLibreGL.LngLatBounds();

      const extendLine = (coords: [number, number][]): void => {
         for (const [lng, lat] of coords) {
            bounds.extend([lng, lat]);
         }
      };

      extendLine(SEA_ROUTE);
      for (const line of ALL_GREEN_ROUTES) {
         extendLine(line);
      }
      bounds.extend(FL_GULF_ORIGIN);
      bounds.extend(HAVANA_PORT);
      bounds.extend(HAVANA_DELIVERY);
      bounds.extend(SANTIAGO_DELIVERY);
      bounds.extend(SHIP_AT_SEA);

      map.fitBounds(bounds, {
         padding: { top: 44, bottom: 52, left: 48, right: 48 },
         duration: 0,
         maxZoom: 6.1,
      });
      didFitRef.current = true;
   }, [isLoaded, map]);

   return null;
}

export function LocationTrackingMap({ labels }: { labels: LocationTrackingMapLabels }): ReactElement {
   return (
      <div className="location-tracking-map absolute inset-0 isolate overflow-hidden">
         <div
            className="pointer-events-none absolute top-2 left-2 z-20 rounded-md border border-white/15 bg-zinc-950/90 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm"
            aria-hidden
         >
            {labels.deliveryBadge}
         </div>
         <Map
            attributionControl={false}
            className="size-full min-h-full"
            maxZoom={14}
            minZoom={4.25}
            scrollZoom={true}
            theme="dark"
            center={[-78.2, 22.85]}
            zoom={5.35}
         >
            <FitRouteViewport />
            <MapRoute color="#3b82f6" coordinates={SEA_ROUTE} opacity={0.95} width={5} />
            <MapRoute
               color="#22c55e"
               coordinates={OVERLAND_HAVANA_SANTIAGO}
               dashArray={GREEN_DASH}
               interactive={false}
               opacity={0.92}
               width={4}
            />

            {PROVINCE_PINS.map(({ id, lng, lat, color }, index) => (
               <MapMarker key={id} latitude={lat} longitude={lng}>
                  <MarkerContent>
                     <AnimatedProvincePin colorHex={color} staggerIndex={index} />
                     <MarkerTooltip>
                        <span className="text-white">{labels.provinces[id]}</span>
                     </MarkerTooltip>
                  </MarkerContent>
               </MapMarker>
            ))}

            <MapMarker latitude={FL_GULF_ORIGIN[1]} longitude={FL_GULF_ORIGIN[0]}>
               <MarkerContent className="flex flex-col items-center">
                  <CircleMarker bgClass="bg-emerald-500">
                     <Ship aria-hidden className="size-3 text-white" strokeWidth={2} />
                  </CircleMarker>
                  <MarkerLabel className="text-[9px] font-semibold text-white drop-shadow-md" position="top">
                     {labels.originHub}
                  </MarkerLabel>
                  <MarkerTooltip>
                     <span className="text-white">{labels.originHub}</span>
                  </MarkerTooltip>
               </MarkerContent>
            </MapMarker>

            <MapMarker latitude={SHIP_AT_SEA[1]} longitude={SHIP_AT_SEA[0]}>
               <MarkerContent className="flex flex-col items-center">
                  <CircleMarker bgClass="bg-blue-500" className="size-7">
                     <Ship aria-hidden className="size-3.5 text-white" strokeWidth={2} />
                  </CircleMarker>
                  <MarkerLabel
                     className="mt-0.5 rounded bg-black/75 px-1 py-0.5 text-[8px] font-medium text-white"
                     position="bottom"
                  >
                     {labels.shipEnRoute}
                  </MarkerLabel>
                  <MarkerTooltip>
                     <span className="text-white">{labels.shipEnRoute}</span>
                  </MarkerTooltip>
               </MarkerContent>
            </MapMarker>

            <MapMarker latitude={HAVANA_DELIVERY[1]} longitude={HAVANA_DELIVERY[0]}>
               <MarkerContent className="flex flex-col items-center">
                  <CircleMarker bgClass="bg-violet-600">
                     <Package aria-hidden className="size-3 text-white" strokeWidth={2} />
                  </CircleMarker>
                  <MarkerLabel className="text-[9px] font-semibold text-white drop-shadow-md" position="top">
                     {labels.havana}
                  </MarkerLabel>
                  <MarkerTooltip>
                     <span className="text-white">{labels.havana}</span>
                  </MarkerTooltip>
               </MarkerContent>
            </MapMarker>

            <MapMarker latitude={SANTIAGO_DELIVERY[1]} longitude={SANTIAGO_DELIVERY[0]}>
               <MarkerContent className="flex flex-col items-center">
                  <CircleMarker bgClass="bg-blue-500">
                     <Home aria-hidden className="size-3 text-white" strokeWidth={2} />
                  </CircleMarker>
                  <MarkerLabel className="text-[9px] font-semibold text-white drop-shadow-md" position="top">
                     {labels.santiago}
                  </MarkerLabel>
                  <MarkerTooltip>
                     <span className="text-white">{labels.santiago}</span>
                  </MarkerTooltip>
               </MarkerContent>
            </MapMarker>

            <AnimatedGroundTruckMarker groundLeg={labels.groundLeg} />
         </Map>
      </div>
   );
}
