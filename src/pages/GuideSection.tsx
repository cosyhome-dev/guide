import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GuideLayout from "@/components/GuideLayout";
import { DynamicZone } from "@/components/guide";
import { useGuideContext, useLocale } from "@/hooks";
import {
  SECTION_CONTENU_KEYS,
  customPageRouteKey,
  customPageFallbackKey,
  type SectionKey,
} from "@/content/property";

export default function GuideSection() {
  const { section } = useParams<{ slug: string; section: string }>();
  const { content, property } = useGuideContext();
  const { locale } = useLocale();
  const t = content.section;
  const s = content.sections;

  // 1) Section fixe (check-in, rules…) → champ contenu dédié.
  const contenuKey = SECTION_CONTENU_KEYS[section as SectionKey];
  // 2) Sinon, page personnalisée : match par slug lisible (dérivé du titre)
  //    OU par l'ancienne clé `p-<id>` (compat des liens/bookmarks existants).
  const customPage = contenuKey
    ? undefined
    : (property.pagesPersonnalisees ?? []).find(
        (p) => customPageRouteKey(p) === section || customPageFallbackKey(p.id) === section,
      );

  const blocks = contenuKey ? property[contenuKey] : customPage?.contenu;
  const pageTitle = contenuKey ? s[section as keyof typeof s] : customPage?.titre;

  if (!blocks) {
    return (
      <GuideLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl mb-4">{t.notFound}</h1>
          <Link
            to={`/${locale}/${property.slug}/guide`}
            className="text-accent hover:underline text-sm"
          >
            {t.back}
          </Link>
        </div>
      </GuideLayout>
    );
  }

  return (
    <GuideLayout>
      <div className="mx-auto max-w-3xl px-4 pt-4 pb-12 md:pt-6 md:pb-14">
        <Link
          to={`/${locale}/${property.slug}/guide`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-small transition-colors"
        >
          <ArrowLeft size={14} />
          <span>{t.back}</span>
        </Link>

        <h1 className="text-3xl mt-8 mb-3 text-center">{pageTitle}</h1>
        <div className="w-14 h-[0.5px] bg-accent mx-auto" />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-6 md:pb-8">
        <DynamicZone blocks={blocks} />
      </div>
    </GuideLayout>
  );
}
