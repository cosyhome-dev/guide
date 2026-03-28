import { useQuery } from "@tanstack/react-query"
import { fetchGuide } from "@/api"
import { useLocale } from "./useLocale"

export function useGuide(slug: string) {
  const { locale } = useLocale()

  return useQuery({
    queryKey: ["guide", slug, locale],
    queryFn: () => fetchGuide(slug, locale),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}
