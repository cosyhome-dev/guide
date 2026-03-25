import { PlaceholderImg } from "@/components/guide"

interface ImageGridProps {
  labels: readonly string[]
}

export default function ImageGrid({ labels }: ImageGridProps) {
  if (labels.length === 0) return null
  if (labels.length === 1) return <PlaceholderImg label={labels[0]} />

  return (
    <div className="grid grid-cols-2 gap-2">
      {labels.map((label, i) => (
        <PlaceholderImg key={i} label={label} />
      ))}
    </div>
  )
}
