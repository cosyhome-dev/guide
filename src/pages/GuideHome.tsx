import { LogIn, LogOut, Car, Home, Trash2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import GuideLayout from "@/components/GuideLayout";
import SafeImage from "@/components/SafeImage";
import { useGuideContext, useLocale } from "@/hooks";
import { fmt, getIcon } from "@/lib";
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
    <GuideLayout overlayHeader hideEmergency>
      {/* Hero */}
      <div className="relative h-[280px] md:h-[340px] overflow-hidden">
        <SafeImage
          src={property.imagePrincipale ?? heroImage}
          alt={property.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/15" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-[calc(1.5rem+10px)] md:px-8 md:pb-[calc(2rem+10px)] text-center">
          <h1 className="text-primary-foreground text-4xl md:text-5xl mb-3">{t.welcome}</h1>
          <p className="text-primary-foreground/80 tracking-[2px] uppercase text-[13px]">
            {property.nom}
          </p>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4">
        {/* Quick info */}
        <div className="mt-10 mb-6">
          {/* Desktop / Tablet */}
          <div className="hidden md:block">
            <div className="flex items-stretch divide-x divide-border rounded-sm overflow-hidden bg-card">
              <QuickInfoCell variant="desktop" label={t.checkIn} lines={[property.infos.heureArrivee]} />
              <QuickInfoCell variant="desktop" label={t.checkOut} lines={[property.infos.heureDepart]} />
              <QuickInfoCell variant="desktop" label={t.accessCodes} lines={codeLines} />
              <QuickInfoCell
                variant="desktop"
                label={t.wifi}
                lines={[property.wifi.nomReseau, fmt(f.password, property.wifi.motDePasse)]}
              />
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="bg-card rounded-sm p-5 space-y-4">
              <div className="flex justify-center gap-8">
                <QuickInfoCell variant="mobile" label={t.checkIn} lines={[property.infos.heureArrivee]} />
                <div className="w-px bg-border" />
                <QuickInfoCell variant="mobile" label={t.checkOut} lines={[property.infos.heureDepart]} />
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-center gap-8">
                <QuickInfoCell variant="mobile" label={t.accessCodes} lines={codeLines} />
                <div className="w-px bg-border" />
                <QuickInfoCell
                  variant="mobile"
                  label={t.wifi}
                  lines={[property.wifi.nomReseau, fmt(f.password, property.wifi.motDePasse)]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Note générale (style ref Lovable : text-small + text-center + mb-8).
            Côté ref c'est hardcodé "La clé ouvre la porte...". Côté guide,
            vient du champ Strapi property.infos.noteGenerale (texte plain). */}
        {property.infos.noteGenerale && (
          <p className="text-small text-muted-foreground text-center mb-8">
            {property.infos.noteGenerale}
          </p>
        )}

        {/* Section grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-[20px] pb-[50px]">
          {sectionKeys.map((key) => {
            const Icon = sectionIcons[key];
            return (
              <Link
                key={key}
                to={`/${locale}/${property.slug}/guide/${key}`}
                className="bg-card border rounded-sm p-6 flex flex-col items-center gap-3 hover:border-accent/50 hover:shadow-sm transition-all group"
              >
                <Icon
                  size={26}
                  strokeWidth={1.2}
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
                <span className="text-[11px] tracking-wider uppercase text-center text-muted-foreground group-hover:text-foreground transition-colors">
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
                to={`/${locale}/${property.slug}/guide/${page.slug}`}
                className="bg-card border rounded-sm p-6 flex flex-col items-center gap-3 hover:border-accent/50 hover:shadow-sm transition-all group"
              >
                <Icon
                  size={26}
                  strokeWidth={1.2}
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
                <span className="text-[11px] tracking-wider uppercase text-center text-muted-foreground group-hover:text-foreground transition-colors">
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

/**
 * Cell info — 2 variantes alignées strict ref Lovable :
 *   desktop : flex-1 p-3 text-center / valeurs font-medium text-sm mt-0.5
 *   mobile  : flex-1 text-center (sans p-3) / valeurs font-medium mt-1
 *            (sans text-sm → hérite body 13px)
 */
function QuickInfoCell({
  label,
  lines,
  variant,
}: {
  label: string;
  lines: string[];
  variant: "desktop" | "mobile";
}) {
  const filtered = lines.filter(Boolean);
  if (variant === "desktop") {
    return (
      <div className="flex-1 p-3 text-center">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        {filtered.map((line, i) => (
          <p key={i} className={`font-medium text-sm text-foreground${i === 0 ? " mt-0.5" : ""}`}>
            {line}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div className="flex-1 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      {filtered.map((line, i) => (
        <p key={i} className={`font-medium text-foreground${i === 0 ? " mt-1" : ""}`}>
          {line}
        </p>
      ))}
    </div>
  );
}
