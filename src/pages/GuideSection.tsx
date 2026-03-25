import React from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import GuideLayout from "@/components/GuideLayout"
import { staticContent } from "@/content"
import {
  SectionArrivee,
  SectionDepart,
  SectionParking,
  SectionLogement,
  SectionDechets,
  SectionRegion,
  SectionRegles,
} from "@/components/guide"

const t = staticContent.section
const s = staticContent.sections

const sectionMap: Record<string, { title: string; component: React.FC }> = {
  arrivee: { title: s.arrivee, component: SectionArrivee },
  depart: { title: s.depart, component: SectionDepart },
  parking: { title: s.parking, component: SectionParking },
  logement: { title: s.logement, component: SectionLogement },
  dechets: { title: s.dechets, component: SectionDechets },
  region: { title: s.region, component: SectionRegion },
  regles: { title: s.regles, component: SectionRegles },
}

export default function GuideSection() {
  const { section } = useParams<{ section: string }>()
  const data = sectionMap[section ?? ""]

  if (!data) {
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

  const SectionComponent = data.component

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

        <h1 className="text-2xl mt-8 mb-3 text-center">{data.title}</h1>
        <div className="w-14 h-px bg-accent mx-auto" />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-8">
        <SectionComponent />
      </div>
    </GuideLayout>
  )
}
