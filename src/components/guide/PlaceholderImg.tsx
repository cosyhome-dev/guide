import React from "react";
import { X } from "lucide-react";

interface PlaceholderImgProps {
  src: string;
  alt?: string;
}

export default function PlaceholderImg({ src, alt = "" }: PlaceholderImgProps) {
  // States
  const [open, setOpen] = React.useState(false);

  // Derived
  const isUrl = src.startsWith("http") || src.startsWith("/");

  // Effects
  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Render
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {isUrl ? (
          <img src={src} alt={alt} className="w-full h-auto block" />
        ) : (
          <span className="text-small text-muted-foreground aspect-video flex items-center justify-center">
            {src}
          </span>
        )}
      </button>

      {open && (
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
            {isUrl ? (
              <img src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain" />
            ) : (
              <div className="bg-muted border border-dashed w-[80vw] aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">{src}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
