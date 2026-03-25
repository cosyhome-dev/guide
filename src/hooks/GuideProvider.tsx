import { Navigate } from "react-router-dom"
import { useStaticContent } from "./useStaticContent"
import { useGuide } from "./useGuide"
import { getAccessCode } from "./useAccessCode"
import { GuideContext } from "./guideContext"

export default function GuideProvider({ children }: { children: React.ReactNode }) {
  const code = getAccessCode()
  const { data: content, isLoading: contentLoading } = useStaticContent()
  const { data: property, isLoading: guideLoading } = useGuide(code)

  if (!code) return <Navigate to="/" replace />

  if (contentLoading || guideLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">...</div>
      </div>
    )
  }

  if (!content || !property) return <Navigate to="/" replace />

  return <GuideContext value={{ content, property }}>{children}</GuideContext>
}
