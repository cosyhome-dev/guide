import React from "react";

export type Locale = "fr" | "en" | "de" | "it";

export const LOCALES: Locale[] = ["fr", "en", "de", "it"];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  de: "DE",
  it: "IT",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = React.createContext<LocaleContextValue>({
  locale: "fr",
  setLocale: () => {},
});

export function useLocale() {
  return React.useContext(LocaleContext);
}
