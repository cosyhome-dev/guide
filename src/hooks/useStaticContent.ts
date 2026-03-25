import { useQuery } from "@tanstack/react-query"
import { fetchStaticContent } from "@/api"

export function useStaticContent() {
  return useQuery({
    queryKey: ["static-content"],
    queryFn: fetchStaticContent,
    staleTime: Infinity,
  })
}
