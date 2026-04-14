import type { BlocBlock } from "@/content/property"
import { ImageGrid, LinkButton } from "@/components/guide"
import { RICHTEXT_CLASS } from "@/lib"

interface BlocProps {
  data: BlocBlock
}

export default function Bloc({ data }: BlocProps) {
  const wrapperClass = data.misEnAvant ? "bg-[#f4f2f0] border p-4 space-y-3" : "space-y-3"

  return (
    <div className={wrapperClass}>
      {(data.surtitre || data.titre) && (
        <div className="space-y-0.5">
          {data.surtitre && (
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{data.surtitre}</p>
          )}
          {data.titre && <h2 className="text-foreground">{data.titre}</h2>}
        </div>
      )}
      {data.contenu && (
        <div className={RICHTEXT_CLASS} dangerouslySetInnerHTML={{ __html: data.contenu }} />
      )}
      {data.liens && data.liens.length > 0 && (
        <div className={`flex flex-wrap gap-2${data.centrerBouton ? " justify-center" : ""}`}>
          {data.liens.map((lien) => (
            <LinkButton key={lien.url} title={lien.label} url={lien.url} />
          ))}
        </div>
      )}
      <ImageGrid images={data.images} />
    </div>
  )
}
