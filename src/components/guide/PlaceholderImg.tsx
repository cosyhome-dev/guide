import React from "react"
import { X } from "lucide-react"

interface PlaceholderImgProps {
  label: string
  src?: string
}

export default function PlaceholderImg({ label, src }: PlaceholderImgProps) {
  // States
  const [open, setOpen] = React.useState(false)

  // Effects
  React.useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  // Handlers
  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  // Render
  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full bg-muted border border-dashed aspect-video flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors"
      >
        {src ? (
          <img src={src} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-small text-muted-foreground">{label}</span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-100 bg-foreground/80 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <button
            className="absolute top-4 right-4 text-background hover:text-background/70 transition-colors"
            onClick={handleClose}
          >
            <X size={28} />
          </button>
          <div
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {src ? (
              <img src={src} alt={label} className="max-w-full max-h-[85vh] object-contain" />
            ) : (
              <div className="bg-muted border border-dashed w-[80vw] aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">{label}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
