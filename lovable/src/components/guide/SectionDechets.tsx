import PlaceholderImg from "./PlaceholderImg";

const SectionDechets = () => (
  <div className="space-y-6">
    {/* Sacs taxés — white card */}
    <div className="bg-card border rounded-sm p-4 space-y-3">
      <h2 className="text-foreground">Sacs poubelle taxés</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        En Suisse, les déchets ménagers doivent être jetés dans des <strong className="text-foreground">sacs poubelle officiels (taxés)</strong>. 
        Ces sacs sont obligatoires et payants — c'est la taxe au sac, qui finance le traitement des déchets.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Vous pouvez les acheter en <strong className="text-foreground">caisse dans tous les supermarchés</strong> (Migros, Coop, Denner). 
        Demandez simplement des « sacs taxés » à la caissière. Ils existent en 17L, 35L et 60L.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Quelques sacs sont mis à disposition sous l'évier de la cuisine pour le début de votre séjour.
      </p>
      <PlaceholderImg label="Photo sac taxé officiel" />
    </div>

    {/* Containers du bâtiment */}
    <div className="space-y-3">
      <h2 className="text-foreground">Containers du bâtiment</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Les poubelles principales se trouvent à l'arrière du bâtiment. Utilisez la porte de service au rez-de-chaussée.
      </p>
      <PlaceholderImg label="Photo emplacement containers arrière" />
    </div>

    {/* Point de collecte */}
    <div className="space-y-3">
      <h2 className="text-foreground">Point de collecte verre & PET</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Un point de collecte pour le verre et le PET se trouve à 50m, sur le parking communal. La déchetterie communale est ouverte le samedi matin pour les encombrants et déchets spéciaux.
      </p>
      <PlaceholderImg label="Photo point de collecte verre/PET" />
    </div>
  </div>
);

export default SectionDechets;
