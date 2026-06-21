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

  return (
    <>
      <button
        type="button"
        onClick={() => isUrl && setOpen(true)}
        className="w-full flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {/* SafeImage gère 2 cas : pas de src → placeholder logo CosyHome,
            URL cassée → fallback automatique sur le même placeholder. */}
        <SafeImage src={isUrl ? src : undefined} alt={alt} className="w-full aspect-video object-cover block" />
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
