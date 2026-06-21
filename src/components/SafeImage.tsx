import React from "react";

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** URL de l'image. Si vide / null / cassée → placeholder logo CosyHome. */
  src?: string | null;
  /** Texte alternatif (toujours requis pour l'accessibilité). */
  alt: string;
}

/**
 * Wrapper `<img>` qui affiche un placeholder visuel (fond beige + logo
 * CosyHome translucide) dans 2 cas :
 *   1. `src` est null/undefined/chaîne vide (image jamais saisie côté Strapi)
 *   2. L'image échoue à charger (URL cassée, S3 down, etc.)
 *
 * À utiliser à la place de `<img>` partout où une image user-data peut
 * manquer (Bloc Strapi, hero GuideHome, Pieces, etc.).
 */
export default function SafeImage({ src, alt, className, style, ...rest }: SafeImageProps) {
  const [errored, setErrored] = React.useState(false);
  const usePlaceholder = !src || errored;

  if (usePlaceholder) {
    return (
      <div
        className={`bg-foreground/5 flex items-center justify-center overflow-hidden ${className ?? ""}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          className="w-1/4 h-1/4 min-w-[40px] min-h-[40px] max-w-[96px] max-h-[96px] opacity-25 object-contain"
        />
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setErrored(true)}
    />
  );
}
