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

  // Drag tactile (mobile) avec VERROUILLAGE D'AXE (retour cliente) :
  //  - horizontal → la piste suit le doigt puis se cale sur l'image voisine ;
  //  - vertical   → l'image suit le doigt et se FERME si on tire assez (dismiss).
  // L'axe est verrouillé au 1er mouvement significatif → les deux gestes ne se
  // marchent pas dessus.
  const startRef = React.useRef<{ x: number; y: number } | null>(null);
  const axisRef = React.useRef<"x" | "y" | null>(null);
  const [dragX, setDragX] = React.useState(0);
  const [dragY, setDragY] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  // Un drag se termine par un `click` synthétique sur l'overlay → ce flag
  // l'ignore pour ne pas fermer juste après le geste.
  const swipedRef = React.useRef(false);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    startRef.current = t ? { x: t.clientX, y: t.clientY } : null;
    axisRef.current = null;
    setDragging(true);
    setDragX(0);
    setDragY(0);
    swipedRef.current = false;
  }
  function onTouchMove(e: React.TouchEvent) {
    const s = startRef.current;
    const t = e.touches[0];
    if (!s || !t) return;
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (axisRef.current === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; // pas encore assez bougé
      axisRef.current = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
    }
    if (axisRef.current === "x") setDragX(dx);
    else setDragY(dy);
  }
  function onTouchEnd(e: React.TouchEvent) {
    const s = startRef.current;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = (t?.clientX ?? s.x) - s.x;
    const dy = (t?.clientY ?? s.y) - s.y;
    const axis = axisRef.current;
    setDragging(false);
    setDragX(0);
    setDragY(0);
    startRef.current = null;
    axisRef.current = null;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) swipedRef.current = true;
    if (axis === "x" && hasMultiple && Math.abs(dx) > 60) {
      if (dx < 0) goNext();
      else goPrev();
    } else if (axis === "y" && Math.abs(dy) > 100) {
      onClose(); // drag vertical suffisant → fermeture (dismiss)
    }
  }
  function onBackdropClick() {
    // Ignore le click synthétique émis juste après un drag.
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    onClose();
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galerie d'images"
      className="fixed inset-0 z-100 touch-none overflow-hidden bg-foreground/90 animate-[overlay-in_200ms_ease-out]"
      onClick={onBackdropClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Piste horizontale : images côte à côte, translatée sur l'index courant
          + l'offset de drag en cours → slide qui suit le doigt puis se cale.
          Pas de transition pendant le drag (suivi 1:1), transition au snap.
          Clic hors image = fermeture (seule l'image stoppe la propagation). */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(calc(-${index * 100}% + ${dragX}px)) translateY(${dragY}px)`,
          transition: dragging ? "none" : "transform 300ms ease-out",
        }}
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
