import React from "react";

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** URL de l'image. Si vide / null / cassée → ne rend rien. */
  src?: string | null;
  /** Texte alternatif (toujours requis pour l'accessibilité). */
  alt: string;
}

/**
 * Wrapper `<img>` qui se rend SILENCIEUX (null) dans 2 cas :
 *   1. `src` est null/undefined/chaîne vide (image jamais saisie côté Strapi)
 *   2. L'image échoue à charger (URL cassée, S3 down, etc.)
 *
 * Auparavant un placeholder beige + logo CosyHome s'affichait à la place,
 * mais ça confondait la cliente (« il met une image par défaut alors que
 * je n'ai rien saisi » — retour 2026-06-28). En prod : pas d'image saisie
 * = pas d'image rendue.
 *
 * Pour avoir un fallback visuel (ex. hero du guide), passer un asset par
 * défaut au niveau du parent : `<SafeImage src={property.imagePrincipale ?? heroImage} ... />`.
 */
export default function SafeImage({ src, alt, className, style, ...rest }: SafeImageProps) {
  const [errored, setErrored] = React.useState(false);
  if (!src || errored) return null;

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
