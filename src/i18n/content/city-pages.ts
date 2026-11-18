import type { Locale } from "@/i18n/config";
import type { CityPage, CityPagesContent } from "@/i18n/types";

import { cityPagesEn } from "./city-pages.en";
import { cityPagesEs } from "./city-pages.es";

const contents: Record<Locale, CityPagesContent> = {
   es: cityPagesEs,
   en: cityPagesEn,
};

/** Stable city slugs, in display order. */
export const citySlugs: string[] = cityPagesEs.cities.map((c) => c.slug);

export function getCityPages(locale: Locale): CityPagesContent {
   return contents[locale];
}

export function getCityPage(locale: Locale, slug: string): CityPage | undefined {
   return contents[locale].cities.find((c) => c.slug === slug);
}

export function isCitySlug(value: string): boolean {
   return citySlugs.includes(value);
}
