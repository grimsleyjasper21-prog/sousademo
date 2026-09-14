import Image from "next/image";
import type { CSSProperties } from "react";
import { text } from "../locale";
import type { ImageRef, Locale } from "../types";

/**
 * Art-directed image. `ratio` drives the box, `focus` drives the crop, and the
 * alt text is per-language — stock imagery never claims to show the premises.
 */
export default function Img({
  image,
  lang,
  fallbackLang,
  ratio,
  sizes = "100vw",
  priority = false,
  className = "",
  style,
  fit = "cover",
}: {
  image: ImageRef;
  lang: Locale;
  fallbackLang: Locale;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  fit?: "cover" | "contain";
}) {
  const alt = text(image.alt, lang, fallbackLang);
  return (
    <div
      className={`media ${className}`}
      style={{ aspectRatio: ratio ?? `${image.width} / ${image.height}`, ...style }}
    >
      <Image
        src={image.url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: fit, objectPosition: image.focus ?? "50% 50%" }}
      />
    </div>
  );
}
