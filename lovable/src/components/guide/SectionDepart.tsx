import { Check } from "lucide-react";

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
    <div className="w-5 h-5 rounded-sm bg-accent/15 shrink-0 mt-0.5 flex items-center justify-center">
      <Check size={12} className="text-accent" />
    </div>
    <p className="text-sm text-foreground leading-relaxed">{text}</p>
  </div>
);

const SectionDepart = () => (
  <div className="space-y-6">
    {/* Check-out time + message combined */}
    <div className="bg-accent/10 border border-accent/20 rounded-sm p-4 text-center space-y-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Check-out</p>
      <p className="text-foreground font-medium">Avant 11h00</p>
      <p className="text-sm text-muted-foreground">Merci de laisser l'appartement dans un état correct. Un supplément pourra être facturé en cas de ménage excessif.</p>
    </div>

    {/* Checklist */}
    <div>
      <h2 className="text-foreground mb-4">Checklist de départ</h2>
      <CheckItem text="Lancez un cycle de lave-vaisselle si nécessaire." />
      <CheckItem text="Videz les poubelles dans les containers à l'arrière du bâtiment." />
      <CheckItem text="Fermez toutes les fenêtres et éteignez les lumières." />
      <CheckItem text="Laissez le thermostat sur 18°C." />
      <CheckItem text="Vérifiez que rien n'a été oublié (placards, réfrigérateur, salle de bain)." />
      <CheckItem text="Replacez la clé dans la boîte à clé à l'entrée du bâtiment." />
    </div>
  </div>
);

export default SectionDepart;
