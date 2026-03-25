import { Link } from "react-router-dom"
import { useStaticContent } from "@/hooks"

export default function NotFound() {
  const { data: content } = useStaticContent()
  const t = content?.notFound

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl mb-4">{t?.title ?? "404"}</h1>
        <p className="text-muted-foreground mb-6">{t?.message}</p>
        <Link to="/" className="text-accent hover:underline text-sm">
          {t?.link}
        </Link>
      </div>
    </div>
  )
}
