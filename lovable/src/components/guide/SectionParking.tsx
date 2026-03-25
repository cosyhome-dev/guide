import { MapPin } from "lucide-react";
import PlaceholderImg from "./PlaceholderImg";

const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Le+Saint+Georges,+Valais,+Suisse";

const SectionParking = () => (
  <div className="space-y-6">
    {/* Address — icon above, centered */}
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

    {/* Winter note — right under address */}
    <div className="bg-accent/10 border border-accent/20 rounded-sm p-4">
      <p className="text-sm text-foreground">❄️ En hiver, merci de ne pas bloquer l'accès au déneigement.</p>
    </div>

    {/* Parking privé */}
    <div className="space-y-3">
      <h2 className="text-foreground">Parking privé</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Une place de parking est disponible devant le bâtiment. La télécommande du garage se trouve dans le tiroir de l'entrée.
      </p>
      <PlaceholderImg label="Photo parking / garage" />
    </div>

    {/* Parking public */}
    <div className="space-y-3">
      <h2 className="text-foreground">Parking public</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Pour les véhicules de grande taille, un parking public gratuit se trouve à 200m en direction du centre.
      </p>
    </div>
  </div>
);

export default SectionParking;
