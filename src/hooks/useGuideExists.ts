import { useQuery } from "@tanstack/react-query";
import { strapiFetch, USE_MOCK } from "@/api/strapi";

/**
 * Check léger qu'un slug de guide existe côté Strapi sans charger
 * tout le contenu. Utilisé par <SlugGuard> avant d'afficher Login.
 *
 * Le champ `slug` est public côté Strapi (permission find activée).
 * On ne révèle aucune info sensible — juste l'existence du logement.
 */
interface SlugListResponse {
  data?: Array<{ slug: string }>;
}

export function useGuideExists(slug: string | undefined) {
  return useQuery<boolean>({
    queryKey: ["guide-exists", slug],
    queryFn: async () => {
      if (!slug) return false;
      if (USE_MOCK) return slug === "le-saint-georges" || slug === "au-bon-coeur";
      const res = await strapiFetch<SlugListResponse>(
        `/guides?filters%5Bslug%5D%5B%24eq%5D=${encodeURIComponent(slug)}&fields%5B0%5D=slug`,
      );
      return (res?.data?.length ?? 0) > 0;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
