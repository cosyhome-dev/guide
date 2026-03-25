import { useQuery } from "@tanstack/react-query"
import { fetchGuide } from "@/api"

export function useGuide(code: string) {
  return useQuery({
    queryKey: ["guide", code],
    queryFn: () => fetchGuide(code),
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
  })
}
