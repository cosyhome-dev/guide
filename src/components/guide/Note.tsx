import type { NoteBlock } from "@/content/property";
import { RICHTEXT_CLASS } from "@/lib";

interface NoteProps {
  data: NoteBlock;
}

/**
 * Note / encadré informatif — pixel-perfect ref Lovable.
 *
 * Wrapper unique : `bg-secondary/40 border rounded-sm p-4` (cf. ref
 * SectionArrivee tip, SectionDechets card, SectionDepart check-out).
 *
 * 3 patterns selon les champs remplis :
 *   1. ni surtitre ni titre → simple paragraphe (ex. "💡 La clé ouvre…")
 *   2. titre seul → h2 uppercase + body muted (style "card heading")
 *   3. surtitre + titre → label uppercase + valeur font-medium + body muted
 *      (style "card info" comme Check-out — surtitre/valeur/desc)
 *
 * `centre: true` ajoute `text-center` au wrapper.
 */
export default function Note({ data }: NoteProps) {
  const hasHeader = Boolean(data.surtitre || data.titre);
  const wrapperClass = [
    "bg-secondary/40 border rounded-sm p-4",
    hasHeader ? "space-y-2" : "",
    data.centre ? "text-center" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass}>
      {data.surtitre && (
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {data.surtitre}
        </p>
      )}
      {data.titre &&
        (data.surtitre ? (
          <p className="text-foreground font-medium">{data.titre}</p>
        ) : (
          <h2 className="text-foreground">{data.titre}</h2>
        ))}
      <div
        className={`${RICHTEXT_CLASS} text-sm leading-relaxed ${
          hasHeader ? "text-muted-foreground" : "text-foreground"
        }`}
        dangerouslySetInnerHTML={{ __html: data.contenu }}
      />
    </div>
  );
}
