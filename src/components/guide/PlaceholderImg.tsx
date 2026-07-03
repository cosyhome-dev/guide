import React from "react";
import { X } from "lucide-react";
import SafeImage from "@/components/SafeImage";

interface PlaceholderImgProps {
  src?: string | null;
  alt?: string;
}

export default function PlaceholderImg({ src, alt = "" }: PlaceholderImgProps) {
  const [open, setOpen] = React.useState(false);
  const isUrl = !!src && (src.startsWith("http") || src.startsWith("/"));

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Pas d'URL valide → on ne rend rien (pas même le wrapper button).
  // Évite l'affichage d'un placeholder fantôme côté voyageur quand la
  // cliente n'a pas saisi d'image (cf. SafeImage retour cliente 2026-06-28).
  if (!isUrl) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center cursor-pointer overflow-hidden mt-6!"
      >
        <SafeImage src={src} alt={alt} className="w-full aspect-video object-cover block" />
      </button>

      {open && isUrl && (
        <div
          className="fixed inset-0 z-100 bg-foreground/80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-background hover:text-background/70 transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>
          <div
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
