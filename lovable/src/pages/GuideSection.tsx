import { useParams, Link } from "react-router-dom";
import GuideLayout from "@/components/GuideLayout";
import { ArrowLeft } from "lucide-react";
import SectionArrivee from "@/components/guide/SectionArrivee";
import SectionDepart from "@/components/guide/SectionDepart";
import SectionParking from "@/components/guide/SectionParking";
import SectionLogement from "@/components/guide/SectionLogement";
import SectionDechets from "@/components/guide/SectionDechets";
import SectionRegion from "@/components/guide/SectionRegion";
import SectionRegles from "@/components/guide/SectionRegles";

const sectionMap: Record<string, { title: string; component: React.FC }> = {
  arrivee: { title: "Arrivée", component: SectionArrivee },
  depart: { title: "Départ", component: SectionDepart },
  parking: { title: "Parking", component: SectionParking },
  logement: { title: "Le Logement", component: SectionLogement },
  dechets: { title: "Déchets", component: SectionDechets },
  region: { title: "Région", component: SectionRegion },
  regles: { title: "Règles", component: SectionRegles },
};

const GuideSection = () => {
  const { section } = useParams<{ section: string }>();
  const data = sectionMap[section || ""];

  if (!data) {
    return (
      <GuideLayout>
        <div className="container max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl mb-4">Section introuvable</h1>
          <Link to="/guide" className="text-accent hover:underline text-sm">Retour au guide</Link>
        </div>
      </GuideLayout>
    );
  }

  const SectionComponent = data.component;

  return (
    <GuideLayout>
      <div className="container max-w-3xl mx-auto px-4 pt-6 pb-6">
        <Link
          to="/guide"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-small transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Retour au guide</span>
        </Link>

        <h1 className="text-2xl mt-8 mb-3 text-center">{data.title}</h1>
        <div className="w-14 h-[0.5px] bg-accent mx-auto" />
      </div>

      <div className="container max-w-3xl mx-auto px-4 pb-8">

        <SectionComponent />
      </div>
    </GuideLayout>
  );
};

export default GuideSection;
