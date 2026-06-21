import type { DynamicZoneBlock } from "@/content/property";
import Bloc from "./Bloc";
import Note from "./Note";
import Checklist from "./Checklist";
import Dropdown from "./Dropdown";

interface DynamicZoneProps {
  blocks: DynamicZoneBlock[];
}

export default function DynamicZone({ blocks }: DynamicZoneProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        const key = `${block.__component}-${block.id}`;
        switch (block.__component) {
          case "guide.bloc":
            return <Bloc key={key} data={block} />;
          case "guide.note":
            return <Note key={key} data={block} />;
          case "guide.checklist":
            return <Checklist key={key} data={block} />;
          case "guide.dropdown":
            return <Dropdown key={key} data={block} />;
        }
      })}
    </div>
  );
}
