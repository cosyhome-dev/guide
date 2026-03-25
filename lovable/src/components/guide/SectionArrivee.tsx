import { MapPin } from "lucide-react";
import PlaceholderImg from "./PlaceholderImg";

const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Le+Saint+Georges,+Valais,+Suisse";

const Step = ({ step, title, desc, imgLabels }: { step: number; title: string; desc?: string; imgLabels?: string[] }) => (
  <div className="space-y-3">
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Étape {step}</p>
      <h2 className="text-left">{title}</h2>
    </div>
    {desc && <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>}
    {imgLabels && imgLabels.length > 0 && (
      <div className={imgLabels.length === 1 ? "" : "grid grid-cols-2 gap-2"}>
        {imgLabels.map((label, i) => (
          <PlaceholderImg key={i} label={label} />
        ))}
      </div>
    )}
  </div>
);

const SectionArrivee = () => (
  <div className="space-y-6">
    {/* Address — centered, icon above */}
    <a
      href={GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 bg-card border rounded-sm p-5 hover:border-accent/50 transition-colors text-center"
    >
      <MapPin size={16} className="text-accent" strokeWidth={1.5} />
      <p className="text-sm text-foreground font-medium">Le Saint Georges — [Adresse complète], Valais</p>
      <p className="text-[11px] text-accent">Ouvrir dans Google Maps ↗</p>
    </a>

    {/* Tip — right under address */}
    <div className="bg-accent/10 border border-accent/20 rounded-sm p-4">
      <p className="text-sm text-foreground">💡 La clé ouvre également le local à ski au sous-sol.</p>
    </div>

    {/* Steps — full width, no left indent */}
    <Step step={1} title="Récupérez la clé" desc="La boîte à clé se trouve à l'entrée du bâtiment. Code : 137617." imgLabels={["Photo boîte à clé"]} />
    <Step step={2} title="Entrez dans l'immeuble" desc="Composez le code du bâtiment sur le digicode : 4521." imgLabels={["Photo entrée immeuble", "Photo digicode", "Photo hall d'entrée"]} />
    <Step step={3} title="Montez au 2ème étage" desc="Par les escaliers ou l'ascenseur." imgLabels={["Photo couloir / ascenseur"]} />
    <Step step={4} title="Ouvrez l'appartement" desc="La même clé ouvre votre porte d'entrée." imgLabels={["Photo porte appartement"]} />
  </div>
);

export default SectionArrivee;
