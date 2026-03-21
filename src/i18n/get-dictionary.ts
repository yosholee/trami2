import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";
import type { LandingMessages } from "@/i18n/types";

const dictionaries: Record<Locale, LandingMessages> = {
  es,
  en,
};

export function getDictionary(locale: Locale): LandingMessages {
  return dictionaries[locale];
}
