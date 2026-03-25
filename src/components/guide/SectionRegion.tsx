import { staticContent } from "@/content"
import { PlaceholderImg, LinkButton } from "@/components/guide"

const t = staticContent.region

export default function SectionRegion() {
  return (
    <div className="space-y-10">
      {/* Commerces */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.commerces.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.commerces.description}</p>
        <PlaceholderImg label="Photo commerces du village" />
      </div>

      {/* Activités hiver */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.hiver.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.hiver.description}</p>
        <LinkButton title={t.hiver.cta.label} url={t.hiver.cta.url} />
        <PlaceholderImg label="Photo domaine skiable / pistes" />
      </div>

      {/* Activités été */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.ete.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.ete.description}</p>
        <PlaceholderImg label="Photo randonnée / paysage été" />
      </div>

      {/* Restaurants */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.restaurants.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.restaurants.description}</p>
        <PlaceholderImg label="Photo restaurant local" />
      </div>

      {/* Transports */}
      <div className="space-y-3">
        <h2 className="text-foreground">{t.transports.title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t.transports.description}</p>
        <LinkButton title={t.transports.cta.label} url={t.transports.cta.url} />
        <PlaceholderImg label="Photo arrêt de bus / gare" />
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
