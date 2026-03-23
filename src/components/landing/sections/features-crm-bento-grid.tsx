import Image from "next/image";

import { cn } from "@/lib/utils";

export interface FeaturesCrmBentoLabels {
   ordersAlt: string;
   dashboardAlt: string;
   logisticsAlt: string;
}

function BentoCrmTile({
   src,
   alt,
   className,
   sizes,
}: {
   src: string;
   alt: string;
   className?: string;
   sizes: string;
}): React.ReactElement {
   return (
      <div
         className={cn(
            "relative min-h-[200px] overflow-hidden rounded-xl border-0 bg-zinc-50/95 shadow-md shadow-zinc-900/8 sm:min-h-[220px] lg:min-h-0 dark:border dark:border-white/8 dark:bg-zinc-900/60 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
            className,
         )}
      >
         <Image src={src} alt={alt} fill className="object-cover object-top-left" sizes={sizes} />
      </div>
   );
}

export function FeaturesCrmBentoGrid({ labels }: { labels: FeaturesCrmBentoLabels }): React.ReactElement {
   return (
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border-0 bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.14)] ring-0 dark:border dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] dark:ring-1 dark:ring-black/50 lg:max-w-none">
         <div className="flex items-center gap-2 border-b-0 bg-zinc-100 px-3 py-2 dark:border-b dark:border-white/10 dark:bg-black/40 sm:px-4 sm:py-2.5">
            <span className="size-2 rounded-full bg-red-500/85 sm:size-2.5" aria-hidden />
            <span className="size-2 rounded-full bg-yellow-500/85 sm:size-2.5" aria-hidden />
            <span className="size-2 rounded-full bg-green-500/85 sm:size-2.5" aria-hidden />
            <span className="ml-1.5 font-mono text-[10px] tracking-tight text-zinc-700 dark:text-zinc-500 sm:text-[11px]">
               app.tramixpress.me
            </span>
         </div>
         <div className="grid grid-cols-1 gap-2 p-2 sm:gap-2.5 sm:p-2.5 lg:grid-cols-12 lg:grid-rows-2 lg:gap-3 lg:p-3">
            <BentoCrmTile
               src="/landing/crm-orders.png"
               alt={labels.ordersAlt}
               sizes="(max-width: 1024px) 100vw, 340px"
               className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-[420px]"
            />
            <BentoCrmTile
               src="/landing/crm-dashboard.png"
               alt={labels.dashboardAlt}
               sizes="(max-width: 1024px) 100vw, 520px"
               className="aspect-16/11 lg:col-span-7 lg:col-start-6 lg:row-span-1 lg:row-start-1 lg:aspect-auto lg:min-h-[200px]"
            />
            <BentoCrmTile
               src="/landing/crm-logistics.png"
               alt={labels.logisticsAlt}
               sizes="(max-width: 1024px) 100vw, 520px"
               className="aspect-16/10 lg:col-span-7 lg:col-start-6 lg:row-span-1 lg:row-start-2 lg:aspect-auto lg:min-h-[200px]"
            />
         </div>
      </div>
   );
}
