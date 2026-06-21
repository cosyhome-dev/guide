import { LogIn, LogOut, Car, Home, Trash2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import GuideLayout from "@/components/GuideLayout";
import { useGuideContext, useLocale } from "@/hooks";
import { fmt, getIcon, RICHTEXT_CLASS } from "@/lib";
import heroImage from "@/assets/hero-guide.jpg";

const sectionKeys = [
  "check-in",
  "check-out",
  "parking",
  "property",
  "waste-recycling",
  "area",
] as const;

const sectionIcons: Record<(typeof sectionKeys)[number], typeof LogIn> = {
  "check-in": LogIn,
  "check-out": LogOut,
  parking: Car,
  property: Home,
  "waste-recycling": Trash2,
  area: MapPin,
};

export default function GuideHome() {
  const { content, property } = useGuideContext();
  const { locale } = useLocale();
  const t = content.home;
  const f = content.format;
  const s = content.sections;

  const codeLines: string[] = [];
  if (property.infos.codeImmeuble) codeLines.push(fmt(f.building, property.infos.codeImmeuble));
  if (property.infos.codeBoiteACles) codeLines.push(fmt(f.keyBox, property.infos.codeBoiteACles));
  for (const c of property.infos.codesSupplementaires) codeLines.push(`${c.nom} : ${c.valeur}`);

  return (
    <GuideLayout hideEmergency>
      {/* Hero */}
      <div className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img
          src={property.imagePrincipale ?? heroImage}
          alt={property.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/40 to-primary/15" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-[calc(1.5rem+10px)] md:px-8 md:pb-[calc(2rem+10px)] text-center">
          <h1 className="text-primary-foreground text-4xl md:text-5xl mb-3">{t.welcome}</h1>
          <p className="text-primary-foreground/80 tracking-[2px] uppercase text-[13px]">
            {property.nom}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {/* Quick info */}
        <div className="my-6">
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="flex items-stretch divide-x divide-border border rounded-sm overflow-hidden bg-card">
              <QuickInfoCell label={t.checkIn} lines={[property.infos.heureArrivee]} />
              <QuickInfoCell label={t.checkOut} lines={[property.infos.heureDepart]} />
              <QuickInfoCell label={t.accessCodes} lines={codeLines} />
              <QuickInfoCell
                label={t.wifi}
                lines={[property.wifi.nomReseau, fmt(f.password, property.wifi.motDePasse)]}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="bg-card border rounded-sm p-5 space-y-4">
              <div className="flex justify-center gap-8">
                <QuickInfoCell label={t.checkIn} lines={[property.infos.heureArrivee]} />
                <div className="w-px bg-border" />
                <QuickInfoCell label={t.checkOut} lines={[property.infos.heureDepart]} />
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-center gap-8">
                <QuickInfoCell label={t.accessCodes} lines={codeLines} />
                <div className="w-px bg-border" />
                <QuickInfoCell
                  label={t.wifi}
                  lines={[property.wifi.nomReseau, fmt(f.password, property.wifi.motDePasse)]}
                />
              </div>
            </div>
          </div>

          {property.infos.noteGenerale && (
            <div
              className={RICHTEXT_CLASS}
              dangerouslySetInnerHTML={{ __html: property.infos.noteGenerale }}
            />
          )}
        </div>

        {/* Section grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-[20px] pb-[50px]">
          {sectionKeys.map((key) => {
            const Icon = sectionIcons[key];
            return (
              <Link
                key={key}
                to={`/${locale}/guide/${property.slug}/${key}`}
                className="bg-card border rounded-sm p-6 flex flex-col items-center gap-3 hover:border-accent/50 hover:shadow-sm transition-all group"
              >
                <Icon
                  size={26}
                  strokeWidth={1.2}
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
                <span className="label-upper text-center group-hover:text-foreground transition-colors">
                  {s[key]}
                </span>
              </Link>
            );
          })}

          {property.customPages.map((page) => {
            const Icon = getIcon(page.icone);
            return (
              <Link
                key={page.slug}
                to={`/${locale}/guide/${property.slug}/${page.slug}`}
                className="bg-card border rounded-sm p-6 flex flex-col items-center gap-3 hover:border-accent/50 hover:shadow-sm transition-all group"
              >
                <Icon
                  size={26}
                  strokeWidth={1.2}
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
                <span className="label-upper text-center group-hover:text-foreground transition-colors">
                  {page.titre}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </GuideLayout>
  );
}

function QuickInfoCell({ label, lines }: { label: string; lines: string[] }) {
  const filtered = lines.filter(Boolean);
  return (
    <div className="flex-1 p-3 text-center">
      <p className="label-upper">{label}</p>
      {filtered.map((line, i) => (
        <p key={i} className={`font-medium text-sm text-foreground${i === 0 ? " mt-0.5" : ""}`}>
          {line}
        </p>
      ))}
    </div>
  );
}
