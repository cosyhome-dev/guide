import { Outlet, useParams } from "react-router-dom";
import { useGuideExists } from "@/hooks";
import GuideSkeleton from "@/components/GuideSkeleton";
import NotFound from "@/pages/NotFound";

/**
 * Garde de route pour /:locale/:slug/* — vérifie que le slug existe
 * côté Strapi avant de rendre Login ou les pages guide. Si le slug est
 * inexistant ou que Strapi renvoie 0 résultat → page 404.
 *
 * Évite qu'un visiteur tape un slug random et voit le formulaire Login
 * (ce qui permettrait théoriquement un brute-force de codes).
 */
export default function SlugGuard() {
  const { slug } = useParams<{ slug: string }>();
  const { data: exists, isLoading, isError } = useGuideExists(slug);

  if (isLoading) return <GuideSkeleton />;
  if (isError || !exists) return <NotFound />;
  return <Outlet />;
}
