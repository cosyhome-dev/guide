import { Navigate, useParams } from "react-router-dom"
import { useStaticContent } from "./useStaticContent"
import { useGuide } from "./useGuide"
import { useLocale } from "./useLocale"
import { getSlug } from "./useAccessCode"
import { GuideContext } from "./guideContext"

export default function GuideProvider({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>()
  const { locale } = useLocale()
  const storedSlug = getSlug()

  // Redirect to login if no stored slug or URL slug mismatch
  if (!slug || !storedSlug || slug !== storedSlug) {
    return <Navigate to={`/${locale}`} replace />
  }

  const { data: content, isLoading: contentLoading } = useStaticContent()
  const { data: property, isLoading: guideLoading } = useGuide(slug)

  if (contentLoading || guideLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">...</div>
      </div>
    )
  }

  if (!content || !property) return <Navigate to={`/${locale}`} replace />

  return <GuideContext value={{ content, property }}>{children}</GuideContext>
}
