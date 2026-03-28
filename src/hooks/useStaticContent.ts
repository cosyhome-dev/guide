import { useQuery } from "@tanstack/react-query"
import { fetchStaticContent } from "@/api"
import { useLocale } from "./useLocale"

export function useStaticContent() {
  const { locale } = useLocale()

  return useQuery({
    queryKey: ["static-content", locale],
    queryFn: () => fetchStaticContent(locale),
    staleTime: Infinity,
  })
}
