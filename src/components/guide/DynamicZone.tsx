import { Fragment } from "react";
import type { DynamicZoneBlock } from "@/content/property";
import { Separator } from "@/components/ui/separator";
import AddressCard from "./AddressCard";
import Bloc from "./Bloc";
import Note from "./Note";
import Checklist from "./Checklist";
import Dropdown from "./Dropdown";

interface DynamicZoneProps {
  blocks: DynamicZoneBlock[];
}

/**
 * Renderer générique des blocs Strapi d'une section.
 *
 * Un séparateur horizontal (style ref Lovable : <div className="py-2"><Separator/></div>)
 * est intercalé automatiquement entre chaque paire de blocs successifs
 * — demande cliente : "ça fait vite serré entre les blocs".
 */
function renderBlock(block: DynamicZoneBlock) {
  switch (block.__component) {
    case "guide.bloc":
      return <Bloc data={block} />;
    case "guide.note":
      return <Note data={block} />;
    case "guide.checklist":
      return <Checklist data={block} />;
    case "guide.dropdown":
      return <Dropdown data={block} />;
    case "guide.adresse-acces":
      return <AddressCard data={block} />;
  }
}

export default function DynamicZone({ blocks }: DynamicZoneProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const key = `${block.__component}-${block.id}`;
        return (
          <Fragment key={key}>
            {i > 0 && (
              <div className="py-2">
                <Separator />
              </div>
            )}
            {renderBlock(block)}
          </Fragment>
        );
      })}
    </div>
  );
}
