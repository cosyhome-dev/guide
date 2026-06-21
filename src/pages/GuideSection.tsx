import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GuideLayout from "@/components/GuideLayout";
import { DynamicZone } from "@/components/guide";
import { useGuideContext, useLocale } from "@/hooks";
import { SECTION_CONTENU_KEYS, SECTION_REUSABLE_KEYS, type SectionKey } from "@/content/property";

export default function GuideSection() {
  const { section } = useParams<{ slug: string; section: string }>();
  const { content, property } = useGuideContext();
  const { locale } = useLocale();
  const t = content.section;
  const s = content.sections;

  const key = section as SectionKey;
  const contenuKey = SECTION_CONTENU_KEYS[key];
  const title = contenuKey ? s[key as keyof typeof s] : undefined;
  const customPage = !contenuKey ? property.customPages.find((p) => p.slug === section) : undefined;

  if (!contenuKey && !customPage) {
    return (
      <GuideLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl mb-4">{t.notFound}</h1>
          <Link
            to={`/${locale}/guide/${property.slug}`}
            className="text-accent hover:underline text-sm"
          >
            {t.back}
          </Link>
        </div>
      </GuideLayout>
    );
  }

  const reusableKey = contenuKey ? SECTION_REUSABLE_KEYS[key] : undefined;
  const reusableBlocks = reusableKey ? property.contenusReutilisables[reusableKey].flat() : [];
  const specificBlocks = contenuKey ? property[contenuKey] : customPage!.contenu;
  const blocks = [...reusableBlocks, ...specificBlocks];
  const pageTitle = contenuKey ? title! : customPage!.titre;

  return (
    <GuideLayout>
      <div className="mx-auto max-w-3xl px-4 pt-6 pb-6">
        <Link
          to={`/${locale}/guide/${property.slug}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-small transition-colors"
        >
          <ArrowLeft size={14} />
          <span>{t.back}</span>
        </Link>

        <h1 className="text-3xl mt-8 mb-3 text-center">{pageTitle}</h1>
        <div className="w-14 h-[0.5px] bg-accent mx-auto" />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-8">
        <DynamicZone blocks={blocks} />
      </div>
    </GuideLayout>
  );
}
