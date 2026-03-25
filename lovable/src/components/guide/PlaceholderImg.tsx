import { useState } from "react";
import { X } from "lucide-react";

interface PlaceholderImgProps {
  label: string;
  src?: string;
}

const PlaceholderImg = ({ label, src }: PlaceholderImgProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full bg-muted border border-dashed rounded-sm aspect-video flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors"
      >
        {src ? (
          <img src={src} alt={label} className="w-full h-full object-cover rounded-sm" />
        ) : (
          <span className="text-small text-muted-foreground">{label}</span>
        )}
      </button>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/80 flex items-center justify-center p-4"
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
            {src ? (
              <img src={src} alt={label} className="max-w-full max-h-[85vh] object-contain rounded-sm" />
            ) : (
              <div className="bg-muted border border-dashed rounded-sm w-[80vw] aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">{label}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceholderImg;
