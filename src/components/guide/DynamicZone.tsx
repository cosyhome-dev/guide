import type { DynamicZoneBlock } from "@/content/property"
import Bloc from "./Bloc"
import Note from "./Note"
import Checklist from "./Checklist"
import Dropdown from "./Dropdown"
import AffichageRegion from "./AffichageRegion"

interface DynamicZoneProps {
  blocks: DynamicZoneBlock[]
}

export default function DynamicZone({ blocks }: DynamicZoneProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.__component) {
          case "guide.bloc":
            return <Bloc key={block.id} data={block} />
          case "guide.note":
            return <Note key={block.id} data={block} />
          case "guide.checklist":
            return <Checklist key={block.id} data={block} />
          case "guide.dropdown":
            return <Dropdown key={block.id} data={block} />
          case "guide.affichage-region":
            return <AffichageRegion key={block.id} data={block} />
        }
      })}
    </div>
  )
}
