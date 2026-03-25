import React from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import GuideLayout from "@/components/GuideLayout"
import { useGuideContext } from "@/hooks"
import {
  SectionArrivee,
  SectionDepart,
  SectionParking,
  SectionLogement,
  SectionDechets,
  SectionRegion,
  SectionRegles,
} from "@/components/guide"

const sectionComponents: Record<string, React.FC> = {
  arrivee: SectionArrivee,
  depart: SectionDepart,
  parking: SectionParking,
  logement: SectionLogement,
  dechets: SectionDechets,
  region: SectionRegion,
  regles: SectionRegles,
}

type SectionKey = keyof typeof sectionComponents

export default function GuideSection() {
  const { section } = useParams<{ section: string }>()
  const { content } = useGuideContext()
  const t = content.section
  const s = content.sections

  const key = section as SectionKey
  const SectionComponent = sectionComponents[key]
  const title = s[key as keyof typeof s]

  if (!SectionComponent || !title) {
    return (
      <GuideLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl mb-4">{t.notFound}</h1>
          <Link to="/guide" className="text-accent hover:underline text-sm">
            {t.back}
          </Link>
        </div>
      </GuideLayout>
    )
  }

  return (
    <GuideLayout>
      <div className="mx-auto max-w-3xl px-4 pt-6 pb-6">
        <Link
          to="/guide"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-small transition-colors"
        >
          <ArrowLeft size={14} />
          <span>{t.back}</span>
        </Link>

        <h1 className="text-2xl mt-8 mb-3 text-center">{title}</h1>
        <div className="w-14 h-px bg-accent mx-auto" />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-8">
        <SectionComponent />
      </div>
    </GuideLayout>
  )
}
