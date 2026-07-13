import SafeImage from "@/components/SafeImage";

interface PlaceholderImgProps {
  src?: string | null;
  alt?: string;
  /** Ouvre la lightbox de galerie (géré par le parent ImageGrid). */
  onOpen?: () => void;
}

/**
 * Vignette cliquable d'une image de guide.
 *
 * Bouton d'affichage pur : l'ouverture plein écran (lightbox + navigation) est
 * portée par le parent `ImageGrid` (retour cliente 2026-07-07). Pas d'animation
 * de zoom au survol (retour cliente 2026-07-07) — seul le curseur signale le clic.
 */
export default function PlaceholderImg({ src, alt = "", onOpen }: PlaceholderImgProps) {
  const isUrl = !!src && (src.startsWith("http") || src.startsWith("/"));

  // Pas d'URL valide → on ne rend rien (pas même le wrapper button).
  // Évite l'affichage d'un placeholder fantôme côté voyageur quand la
  // cliente n'a pas saisi d'image (cf. SafeImage retour cliente 2026-06-28).
  if (!isUrl) return null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full flex items-center justify-center cursor-pointer overflow-hidden"
    >
      <SafeImage src={src} alt={alt} className="w-full aspect-video object-cover block" />
    </button>
  );
}
