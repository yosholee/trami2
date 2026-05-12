"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
   TRACKING_ERROR_NOT_CONFIGURED,
   TRACKING_ERROR_RATE_LIMITED,
   useFetchByInvoiceOrHBL,
} from "@/hooks/use-fetch-by-invoice-or-hbl";
import type { LandingMessages } from "@/i18n/types";
import { ctEnviosUrl } from "@/lib/site";

import { TrackingDetails } from "./tracking-details";

type TrackingUi = LandingMessages["tracking"];

function formatTrackingError(
   error: Error,
   labels: Pick<TrackingUi, "errorGeneric" | "rateLimited" | "notConfigured">,
): string {
   if (error.message === TRACKING_ERROR_RATE_LIMITED) {
      return labels.rateLimited;
   }
   if (error.message === TRACKING_ERROR_NOT_CONFIGURED) {
      return labels.notConfigured;
   }
   if (error.message.includes("429")) {
      return labels.rateLimited;
   }
   return error.message || labels.errorGeneric;
}

export function TrackingSearchSection({
   labels,
   initialSearch = "",
}: {
   labels: TrackingUi;
   /** Seed from URL `?search=` (server passes `searchParams`). */
   initialSearch?: string;
}): ReactElement {
   const searchParams = useSearchParams();
   const [submittedTerm, setSubmittedTerm] = useState("");
   const [inputValue, setInputValue] = useState(initialSearch);

   useEffect(() => {
      const fromUrl = searchParams.get("search");
      if (fromUrl != null && fromUrl !== "") {
         const t = fromUrl.trim();
         setInputValue(fromUrl);
         setSubmittedTerm(t);
         return;
      }
      if (initialSearch.trim() !== "") {
         setInputValue(initialSearch);
         setSubmittedTerm(initialSearch.trim());
      }
   }, [searchParams, initialSearch]);

   const { data, isLoading, isError, error, isFetching } = useFetchByInvoiceOrHBL(submittedTerm);
   function onSubmit(e: React.SubmitEvent<HTMLFormElement>): void {
      e.preventDefault();
      const raw = new FormData(e.currentTarget).get("search");
      setSubmittedTerm(String(raw ?? "").trim());
   }

   const busy = isLoading || isFetching;

   return (
      <section className="mx-auto mt-10 w-full space-y-6 text-left">
         <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
            <div className="space-y-2">
               <label htmlFor="tracking-search" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {labels.fieldLabel}
               </label>
               <input
                  id="tracking-search"
                  name="search"
                  type="text"
                  autoComplete="off"
                  placeholder={labels.placeholder}
                  value={inputValue}
                  onChange={(ev) => setInputValue(ev.target.value)}
                  className="h-12 w-full rounded-full border-0 bg-zinc-100 px-4 text-base text-zinc-950 shadow-inner outline-none ring-0 placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-amber-500/80 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:ring-[#facc15]/50"
               />
            </div>
            <Button
               type="submit"
               disabled={busy}
               className="h-12 w-full rounded-full bg-[#eab308] font-semibold text-zinc-950 transition-colors duration-150 hover:bg-[#f59e0b] dark:bg-[#facc15] dark:text-[#1a1a1a] dark:hover:bg-[#eab308]"
            >
               {busy ? labels.searching : labels.submit}
            </Button>
         </form>

         {isError && error ? (
            <p role="alert" className="text-center text-sm text-red-600 dark:text-red-400">
               {formatTrackingError(error, labels)}
            </p>
         ) : null}

         {data != null ? (
            <div className="mx-auto w-full max-w-5xl min-w-0">
               <TrackingDetails invoice={data} labels={labels} />
            </div>
         ) : null}

         <div className="mx-auto max-w-md space-y-1 text-center text-xs text-zinc-600 dark:text-zinc-500">
            <p>{labels.opensAppHint}</p>
            <p>
               {labels.poweredByPrefix}{" "}
               <a
                  href={ctEnviosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-800 underline decoration-amber-700/40 underline-offset-4 hover:text-amber-950 dark:text-[#facc15] dark:decoration-[#facc15]/40 dark:hover:text-[#fde047]"
               >
                  {labels.poweredByLink}
               </a>{" "}
               {labels.poweredBySuffix}
            </p>
         </div>
      </section>
   );
}
