import React from "react";
import { PlaceholderImg, Lightbox } from "@/components/guide";

interface ImageGridProps {
  images: readonly string[];
}

/**
 * Grille d'images d'un bloc + lightbox de galerie (retour cliente 2026-07-07).
 *
 * L'état d'ouverture/index est porté ICI (pas dans PlaceholderImg) pour que la
 * lightbox connaisse TOUTES les images du bloc → navigation suivant/précédent
 * sans revenir à la page.
 */
export default function ImageGrid({ images }: ImageGridProps) {
  // Filtre les URLs invalides pour garder des index cohérents avec la lightbox
  // (PlaceholderImg ne rendait rien pour une URL vide → décalage sinon).
  const valid = React.useMemo(
    () => images.filter((src) => !!src && (src.startsWith("http") || src.startsWith("/"))),
    [images],
  );
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  if (valid.length === 0) return null;

  return (
    <>
      {valid.length === 1 ? (
        <PlaceholderImg src={valid[0]} onOpen={() => setOpenIndex(0)} />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {valid.map((src, i) => (
            <PlaceholderImg key={i} src={src} onOpen={() => setOpenIndex(i)} />
          ))}
        </div>
      )}

      {openIndex !== null && (
        <Lightbox
          images={valid}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
