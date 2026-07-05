import { Navigate, useParams } from "react-router-dom";
import { useStaticContent } from "./useStaticContent";
import { useGuide } from "./useGuide";
import { useLocale } from "./useLocale";
import { getSlug, getToken } from "./useAccessCode";
import { GuideContext } from "./guideContext";
import GuideSkeleton from "@/components/GuideSkeleton";
import NotFound from "@/pages/NotFound";

export default function GuideProvider({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const storedSlug = getSlug();
  const token = getToken();

  // Session valide = slug d'URL présent, identique au slug stocké, + jeton signé.
  const hasSession = Boolean(slug && storedSlug && slug === storedSlug && token);

  // ⚠️ Hooks appelés INCONDITIONNELLEMENT (rules-of-hooks) : on ne fait PLUS
  // de return AVANT ces hooks. La requête guide n'est déclenchée que si la
  // session est valide (param `enabled` de useGuide).
  const { data: content, isLoading: contentLoading } = useStaticContent();
  const {
    data: property,
    isLoading: guideLoading,
    isError: guideError,
  } = useGuide(slug ?? "", hasSession);

  // Pas de session (pas de jeton ou mismatch slug) → login DE CE BIEN.
  // Routing : /:locale/:slug/guide/... → Login = /:locale/:slug/
  if (!hasSession) {
    return <Navigate to={`/${locale}/${slug ?? ""}`} replace />;
  }

  if (contentLoading || guideLoading) {
    return <GuideSkeleton />;
  }

  // Slug a priori conforme mais le guide ne se résout/charge pas (bien
  // dépublié ou supprimé, données Strapi cassées, réseau…) : on affiche une
  // vraie page « introuvable » AU LIEU de rediriger vers l'accueil — ce qui
  // donnait l'illusion d'une déconnexion (retour cliente) ou d'une page
  // normale. La session (jeton signé) n'est PAS purgée : un simple refresh
  // rechargera le guide si le problème côté Strapi est corrigé.
  if (guideError || !property || !content) return <NotFound />;

  return <GuideContext value={{ content, property }}>{children}</GuideContext>;
}
