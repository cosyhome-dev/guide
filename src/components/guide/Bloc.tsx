import type { BlocBlock } from "@/content/property"
import { ImageGrid, LinkButton } from "@/components/guide"
import { RICHTEXT_CLASS } from "@/lib"

interface BlocProps {
  data: BlocBlock
}

export default function Bloc({ data }: BlocProps) {
  const wrapperClass = data.misEnAvant ? "bg-card border p-4 space-y-3" : "space-y-3"

  return (
    <div className={wrapperClass}>
      {data.sousTitre && (
        <p className="text-sm font-medium text-muted-foreground">{data.sousTitre}</p>
      )}
      {data.titre && <h2 className="text-foreground">{data.titre}</h2>}
      {data.contenu && (
        <div className={RICHTEXT_CLASS} dangerouslySetInnerHTML={{ __html: data.contenu }} />
      )}
      <ImageGrid images={data.images} />
      {data.liens && data.liens.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.liens.map((lien) => (
            <LinkButton key={lien.url} title={lien.label} url={lien.url} />
          ))}
        </div>
      )}
    </div>
  )
}
