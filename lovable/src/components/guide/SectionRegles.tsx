import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const rules = [
  { title: "Bruit", content: "Respect du voisinage : pas de bruit après 22h00. L'immeuble est habité par des résidents permanents." },
  { title: "Tabac", content: "Interdiction de fumer à l'intérieur de l'appartement. Un cendrier est disponible sur le balcon." },
  { title: "Animaux", content: "Animaux non autorisés sauf accord préalable avec le concierge." },
  { title: "Occupants", content: "Le nombre maximum d'occupants correspond à celui indiqué dans votre réservation. Aucun visiteur supplémentaire n'est autorisé à dormir sur place." },
  { title: "Dommages", content: "Tout dommage doit être signalé immédiatement au concierge. Une caution pourra être retenue en cas de dégât non déclaré." },
  { title: "Ménage", content: "Merci de laisser l'appartement dans un état correct au départ. Un supplément de nettoyage pourra être facturé si nécessaire." },
  { title: "Clés", content: "En cas de perte de clé, des frais de remplacement de CHF 150.- seront facturés." },
  { title: "Énergie", content: "Merci d'éteindre les lumières et de fermer les fenêtres lorsque vous quittez l'appartement, même temporairement." },
];

const SectionRegles = () => (
  <Accordion type="multiple" className="w-full">
    {rules.map((rule, i) => (
      <AccordionItem key={i} value={`rule-${i}`}>
        <AccordionTrigger>
          <h2 className="text-left">{rule.title}</h2>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{rule.content}</p>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default SectionRegles;
