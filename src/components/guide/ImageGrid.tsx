import { PlaceholderImg } from "@/components/guide"

interface ImageGridProps {
  images: readonly string[]
}

export default function ImageGrid({ images }: ImageGridProps) {
  if (images.length === 0) return null
  if (images.length === 1) return <PlaceholderImg src={images[0]} />

  return (
    <div className="columns-2 gap-2 space-y-2">
      {images.map((src, i) => (
        <div key={i} className="break-inside-avoid">
          <PlaceholderImg src={src} />
        </div>
      ))}
    </div>
  )
}
