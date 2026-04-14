import { Info } from "lucide-react"
import type { NoteBlock } from "@/content/property"
import { RICHTEXT_CLASS } from "@/lib"

interface NoteProps {
  data: NoteBlock
}

export default function Note({ data }: NoteProps) {
  return (
    <div className="bg-[#dbd8d5] border border-accent/20 p-4 flex gap-3">
      <Info size={16} className="text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
      <div className={data.centre ? "text-center w-full" : ""}>
        {data.surtitre && (
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{data.surtitre}</p>
        )}
        {data.titre && <h3 className="text-lg font-semibold">{data.titre}</h3>}
        <div className={RICHTEXT_CLASS} dangerouslySetInnerHTML={{ __html: data.contenu }} />
      </div>
    </div>
  )
}
