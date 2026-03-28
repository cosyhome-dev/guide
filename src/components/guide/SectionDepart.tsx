import { Check } from "lucide-react"
import { useGuideContext } from "@/hooks"

export default function SectionDepart() {
  const { content, property } = useGuideContext()
  const t = content.depart

  return (
    <div className="space-y-6">
      {/* Check-out box */}
      <div className="bg-accent/10 border border-accent/20 p-4 text-center space-y-2">
        <p className="label-upper">{t.checkoutLabel}</p>
        <p className="text-foreground font-medium">{property.depart.heureDepart}</p>
        <p className="text-sm text-muted-foreground">{property.depart.messageDepart}</p>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-foreground mb-4">{t.checklistTitle}</h2>
        {property.depart.checklist.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-3 border-b last:border-b-0">
            <div className="w-5 h-5 bg-accent/15 shrink-0 mt-0.5 flex items-center justify-center">
              <Check size={12} className="text-accent" />
            </div>
            <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
