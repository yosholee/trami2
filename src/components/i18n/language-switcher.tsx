"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";

export interface LanguageSwitcherLabels {
  label: string;
  es: string;
  en: string;
}

export function LanguageSwitcher({
  current,
  labels,
}: {
  current: Locale;
  labels: LanguageSwitcherLabels;
}): React.ReactElement {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const rest = locales.includes(first as Locale)
    ? segments.slice(1).join("/")
    : segments.join("/");

  function hrefFor(target: Locale): string {
    const path = rest ? `/${target}/${rest}` : `/${target}`;
    return path;
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border-0 bg-zinc-100 p-0.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:border dark:border-white/15 dark:bg-white/5 dark:shadow-none"
      role="group"
      aria-label={labels.label}
    >
      {locales.map((loc) => (
        <Button
          key={loc}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 min-w-9 rounded-full px-2.5 text-xs font-semibold",
            loc === current
              ? "bg-[#FFB800] text-zinc-950 hover:bg-[#FFB800]"
              : "text-zinc-600 transition-colors duration-150 hover:bg-zinc-950/[0.09] hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          )}
          render={<Link href={hrefFor(loc)} scroll={false} />}
        >
          {loc === "es" ? labels.es : labels.en}
        </Button>
      ))}
    </div>
  );
}
