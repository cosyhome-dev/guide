import { MoveRight } from "lucide-react";
import PlaceholderImg from "./PlaceholderImg";

const LinkButton = ({ title, url }: { title: string; url: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex items-center gap-3 bg-accent rounded-sm px-5 py-2.5 text-sm text-accent-foreground transition-all duration-300 hover:bg-accent/85"
  >
    <span>{title}</span>
    <MoveRight size={14} className="text-accent-foreground/70 group-hover:translate-x-1.5 group-hover:text-accent-foreground transition-all duration-300" />
  </a>
);

const SectionRegion = () => (
  <div className="space-y-10">
    {/* Commerces */}
    <div className="space-y-3">
      <h2 className="text-foreground">Commerces</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Vous trouverez à proximité un supermarché Migros (5 min à pied) et un Coop (8 min à pied) pour vos courses alimentaires et articles ménagers. 
        Les sacs taxés sont disponibles en caisse. Une boulangerie artisanale se situe à 3 minutes à pied, ainsi qu'une pharmacie à 10 minutes.
      </p>
      <PlaceholderImg label="Photo commerces du village" />
    </div>

    {/* Activités hiver */}
    <div className="space-y-3">
      <h2 className="text-foreground">Activités — Hiver</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Le domaine skiable se trouve à 8 minutes en voiture, avec plus de 100 km de pistes. Les forfaits sont disponibles en ligne (recommandé pour éviter les files d'attente). 
        Un centre thermal avec spa et espace détente est accessible en 15 minutes. Plusieurs sentiers raquettes balisés partent directement du village.
      </p>
      <LinkButton title="Domaine skiable — Forfaits en ligne" url="https://example.com/ski" />
      <PlaceholderImg label="Photo domaine skiable / pistes" />
    </div>

    {/* Activités été */}
    <div className="space-y-3">
      <h2 className="text-foreground">Activités — Été</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        La région offre un réseau de sentiers de randonnée balisés. Des cartes sont disponibles à l'office du tourisme. 
        La location de vélos électriques est possible au village. La piscine municipale est ouverte de juin à septembre (10 min à pied).
      </p>
      <PlaceholderImg label="Photo randonnée / paysage été" />
    </div>

    {/* Restaurants */}
    <div className="space-y-3">
      <h2 className="text-foreground">Restaurants</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Plusieurs restaurants sont accessibles à pied : Le Carrefour (cuisine locale, 5 min), Pizzeria Da Luigi (pizzas au feu de bois, 3 min), 
        ainsi qu'un restaurant d'altitude accessible par les remontées mécaniques avec vue panoramique.
      </p>
      <PlaceholderImg label="Photo restaurant local" />
    </div>

    {/* Transports */}
    <div className="space-y-3">
      <h2 className="text-foreground">Bus et transports</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Un arrêt de bus se trouve à 2 minutes à pied avec des lignes vers Sion et les stations voisines. 
        La gare CFF la plus proche est à 15 minutes en voiture. Consultez les horaires en ligne.
      </p>
      <LinkButton title="CFF — Horaires en ligne" url="https://www.sbb.ch" />
      <PlaceholderImg label="Photo arrêt de bus / gare" />
    </div>

    {/* Offices du tourisme */}
    <div className="space-y-3">
      <h2 className="text-foreground">Offices du tourisme</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        L'office du tourisme local propose des informations, des cartes et un programme d'événements et d'activités. 
        Le portail Valais Tourisme centralise l'ensemble des offres de la région.
      </p>
      <div className="flex flex-wrap gap-2">
        <LinkButton title="Office du tourisme local" url="https://example.com/tourisme" />
        <LinkButton title="Valais Tourisme" url="https://www.valais.ch" />
      </div>
    </div>
  </div>
);

export default SectionRegion;
