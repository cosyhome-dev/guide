import React from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "@/components/SafeImage";

interface LightboxProps {
  /** Toutes les images de la galerie (URLs déjà filtrées/valides). */
  images: readonly string[];
  /** Index de l'image affichée. */
  index: number;
  /** Change l'image affichée (navigation). */
  onIndexChange: (i: number) => void;
  /** Ferme la lightbox. */
  onClose: () => void;
  alt?: string;
}

/**
 * Galerie plein écran (lightbox) — retours cliente 2026-07-07.
 *
 * Ouvre une image et permet de parcourir toute la galerie sans revenir à la
 * page : flèches ←/→ (desktop) + clavier, swipe (mobile), fermeture croix /
 * clic à l'extérieur / Échap. Ouverture en fondu ; navigation en SLIDE
 * horizontal (piste translateX).
 *
 * Rendue dans un portal sur <body> → jamais clippée par un ancêtre
 * `overflow-hidden` (ex. l'animation d'accordéon).
 *
 * ⚠️ Comportement à garder aligné avec la lightbox du site principal
 * (frontend/components/common/image-lightbox.tsx) — même UX, deux stacks.
 */
export default function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
  alt = "",
}: LightboxProps) {
  const count = images.length;
  const hasMultiple = count > 1;

  const goPrev = React.useCallback(
    () => onIndexChange((index - 1 + count) % count),
    [index, count, onIndexChange],
  );
  const goNext = React.useCallback(
    () => onIndexChange((index + 1) % count),
    [index, count, onIndexChange],
  );

  // Clavier : Échap ferme, ←/→ naviguent.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasMultiple) goPrev();
      else if (e.key === "ArrowRight" && hasMultiple) goNext();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, goPrev, goNext, hasMultiple]);

  // Verrouille le scroll de la page tant que la lightbox est ouverte.
  React.useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Swipe tactile (mobile) : seuil 50px pour éviter les faux positifs.
  const touchStartX = React.useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || !hasMultiple) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galerie d'images"
      className="fixed inset-0 z-100 overflow-hidden bg-foreground/90 animate-[overlay-in_200ms_ease-out]"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Piste horizontale : toutes les images côte à côte, translatée sur
          l'index courant → transition en slide. Clic hors image = fermeture
          (seule l'image stoppe la propagation). */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((s, i) => (
          <div key={i} className="flex h-full w-full shrink-0 items-center justify-center p-4">
            <SafeImage
              src={s}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Fermer"
        className="absolute top-4 right-4 z-10 text-background transition-colors hover:text-background/70"
        onClick={onClose}
      >
        <X size={28} />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Image précédente"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-2 text-background transition-colors hover:text-background/70 sm:left-4"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            <ChevronLeft size={40} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Image suivante"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-2 text-background transition-colors hover:text-background/70 sm:right-4"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            <ChevronRight size={40} strokeWidth={1.5} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm tracking-wide text-background/80">
            {index + 1} / {count}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}
