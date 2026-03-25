import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import PlaceholderImg from "./PlaceholderImg";

const logementItems = [
  {
    title: "Cuisine",
    desc: "Machine Nespresso (capsules fournies), lave-vaisselle, four, micro-ondes. Ustensiles et vaisselle dans les placards.",
    images: ["Photo cuisine vue 1", "Photo cuisine vue 2"],
  },
  {
    title: "Salle de bain",
    desc: "Serviettes fournies. Des serviettes supplémentaires sont disponibles dans l'armoire du couloir. Sèche-cheveux sous le lavabo.",
    images: ["Photo salle de bain"],
  },
  {
    title: "Chauffage & Thermostat",
    desc: "Le thermostat se trouve dans le couloir. Merci de le laisser sur 18°C à votre départ.",
    images: ["Photo thermostat"],
  },
  {
    title: "TV & WiFi",
    desc: "Chaînes internationales disponibles. Le WiFi couvre l'ensemble de l'appartement. Identifiants affichés sur la page d'accueil du guide.",
    images: ["Photo salon / TV"],
  },
  {
    title: "Buanderie",
    desc: "Machine à laver et sèche-linge au sous-sol. Lessive disponible sur place. Étendoir dans le placard de l'entrée.",
    images: ["Photo buanderie vue 1", "Photo buanderie vue 2"],
  },
  {
    title: "Local à ski",
    desc: "Situé au sous-sol, accessible avec la même clé que l'appartement. Suivez le couloir jusqu'au fond.",
    images: [
      "Photo porte local à ski",
      "Photo couloir sous-sol",
      "Photo intérieur local",
      "Photo racks à ski",
      "Photo casiers",
      "Photo accès depuis entrée",
    ],
  },
];

const SectionLogement = () => (
  <div className="space-y-6">
    {/* Intro text — no frame */}
    <p className="text-sm text-muted-foreground leading-relaxed">
      Voici les informations pratiques pour profiter de votre logement. N'hésitez pas à nous contacter si vous avez la moindre question.
    </p>

    <Accordion type="multiple" className="w-full">
      {logementItems.map((item, i) => (
        <AccordionItem key={i} value={`logement-${i}`}>
          <AccordionTrigger>
            <h2 className="text-left">{item.title}</h2>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              <div className={item.images.length === 1 ? "" : "grid grid-cols-2 gap-2"}>
                {item.images.map((img, j) => (
                  <PlaceholderImg key={j} label={img} />
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default SectionLogement;
