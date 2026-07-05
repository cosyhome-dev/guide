import { useQuery } from "@tanstack/react-query";
import { fetchGuide } from "@/api";
import { useLocale } from "./useLocale";

export function useGuide(slug: string, enabled = true) {
  const { locale } = useLocale();

  return useQuery({
    queryKey: ["guide", slug, locale],
    queryFn: () => fetchGuide(slug, locale),
    // `enabled` permet à GuideProvider d'appeler ce hook inconditionnellement
    // (rules-of-hooks) tout en ne déclenchant la requête que si la session
    // voyageur est valide.
    enabled: !!slug && enabled,
    staleTime: 5 * 60 * 1000,
  });
}
