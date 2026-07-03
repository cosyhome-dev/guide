import { Navigate, useParams } from "react-router-dom";
import { useStaticContent } from "./useStaticContent";
import { useGuide } from "./useGuide";
import { useLocale } from "./useLocale";
import { getSlug, getToken } from "./useAccessCode";
import { GuideContext } from "./guideContext";
import GuideSkeleton from "@/components/GuideSkeleton";

export default function GuideProvider({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const { locale } = useLocale();
  const storedSlug = getSlug();
  const token = getToken();

  // Redirect to login (de ce bien) si pas de session (slug + jeton signé)
  // ou mismatch slug. Routing : /:locale/:slug/guide/... → Login = /:locale/:slug/
  if (!slug || !storedSlug || slug !== storedSlug || !token) {
    return <Navigate to={`/${locale}/${slug ?? ""}`} replace />;
  }

  const { data: content, isLoading: contentLoading } = useStaticContent();
  const { data: property, isLoading: guideLoading } = useGuide(slug);

  if (contentLoading || guideLoading) {
    return <GuideSkeleton />;
  }

  if (!content || !property) return <Navigate to={`/${locale}`} replace />;

  return <GuideContext value={{ content, property }}>{children}</GuideContext>;
}
