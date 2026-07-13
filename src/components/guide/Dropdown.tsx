import { Accordion, ImageGrid } from "@/components/guide";
import type { DropdownBlock } from "@/content/property";
import { RICHTEXT_CLASS } from "@/lib";

interface DropdownProps {
  data: DropdownBlock;
}

export default function Dropdown({ data }: DropdownProps) {
  return (
    <Accordion
      items={data.elements.map((el) => ({
        title: el.titre,
        content: (
          <div className="space-y-4">
            <div className={RICHTEXT_CLASS} dangerouslySetInnerHTML={{ __html: el.description }} />
            {/* Images par entrée (retour cliente 2026-07-07) → galerie + lightbox. */}
            {el.images && el.images.length > 0 && <ImageGrid images={el.images} />}
          </div>
        ),
      }))}
    />
  );
}
