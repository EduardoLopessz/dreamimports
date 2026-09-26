import Image from "next/image";
import type { ProductImage } from "@/db/schema";
import { cn, pexels } from "@/lib/utils";

type Props = {
  image: Pick<ProductImage, "pexelsId" | "alt" | "focus">;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  quality?: 75 | 85;
  imgStyle?: React.CSSProperties;
};

/** Foto real do Pexels, preenchendo o container. O fundo cinza aparece enquanto carrega. */
export function Photo({ image, sizes, className, imgClassName, priority, quality = 75, imgStyle }: Props) {
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      <Image
        src={pexels(image.pexelsId)}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={cn("object-cover text-transparent", imgClassName)}
        style={{ objectPosition: image.focus ?? "50% 30%", ...imgStyle }}
      />
    </div>
  );
}
