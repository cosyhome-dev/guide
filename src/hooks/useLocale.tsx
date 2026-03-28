import React from "react"

export type Locale = "fr" | "en" | "de" | "it"

export const LOCALES: Locale[] = ["fr", "en", "de", "it"]

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  de: "DE",
  it: "IT",
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = React.createContext<LocaleContextValue>({
  locale: "fr",
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>("fr")

  const value = React.useMemo(() => ({ locale, setLocale }), [locale])

  return <LocaleContext value={value}>{children}</LocaleContext>
}

export function useLocale() {
  return React.useContext(LocaleContext)
}
