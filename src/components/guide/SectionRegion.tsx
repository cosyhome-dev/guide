import { useGuideContext } from "@/hooks"
import { PlaceholderImg, LinkButton } from "@/components/guide"

export default function SectionRegion() {
  const { content } = useGuideContext()
  const t = content.region
  const ph = content.placeholders

  return (
    <div className="space-y-10">
      {/* Commerces */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.commerces.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.commerces.description}</p>
        <PlaceholderImg label={ph.commerces} />
      </div>

      {/* Activités hiver */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.hiver.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.hiver.description}</p>
        <LinkButton title={t.hiver.cta.label} url={t.hiver.cta.url} />
        <PlaceholderImg label={ph.skiDomain} />
      </div>

      {/* Activités été */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.ete.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.ete.description}</p>
        <PlaceholderImg label={ph.hiking} />
      </div>

      {/* Restaurants */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.restaurants.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.restaurants.description}</p>
        <PlaceholderImg label={ph.restaurant} />
      </div>

      {/* Transports */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.transports.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.transports.description}</p>
        <LinkButton title={t.transports.cta.label} url={t.transports.cta.url} />
        <PlaceholderImg label={ph.busStation} />
      </div>

      {/* Offices du tourisme */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.tourisme.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.tourisme.description}</p>
        <div className="flex flex-wrap gap-2">
          {t.tourisme.ctas.map((cta) => (
            <LinkButton key={cta.url} title={cta.label} url={cta.url} />
          ))}
        </div>
      </div>
    </div>
  )
}
