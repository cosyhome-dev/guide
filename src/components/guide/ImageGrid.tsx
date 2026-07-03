import { PlaceholderImg } from "@/components/guide";

interface ImageGridProps {
  images: readonly string[];
}

export default function ImageGrid({ images }: ImageGridProps) {
  if (images.length === 0) return null;
  if (images.length === 1) return <PlaceholderImg src={images[0]} />;

  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((src, i) => (
        <PlaceholderImg key={i} src={src} />
      ))}
    </div>
  );
}
