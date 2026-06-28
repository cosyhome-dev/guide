import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GuideLayout from "@/components/GuideLayout";
import { DynamicZone } from "@/components/guide";
import { useGuideContext, useLocale } from "@/hooks";
import { SECTION_CONTENU_KEYS, type SectionKey } from "@/content/property";

export default function GuideSection() {
  const { section } = useParams<{ slug: string; section: string }>();
  const { content, property } = useGuideContext();
  const { locale } = useLocale();
  const t = content.section;
  const s = content.sections;

  const key = section as SectionKey;
  const contenuKey = SECTION_CONTENU_KEYS[key];

  if (!contenuKey) {
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

  const blocks = property[contenuKey];
  const pageTitle = s[key as keyof typeof s];

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
