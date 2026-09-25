import Image from "next/image";
import type { ProductImage } from "@/db/schema";
import { cn, unsplash } from "@/lib/utils";

type Props = {
  image: Pick<ProductImage, "unsplashId" | "alt">;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  quality?: 75 | 85;
};

/** Foto real do Unsplash, preenchendo o container. O fundo cinza aparece enquanto carrega. */
export function Photo({ image, sizes, className, imgClassName, priority, quality = 75 }: Props) {
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      <Image
        src={unsplash(image.unsplashId)}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={cn("object-cover text-transparent", imgClassName)}
      />
    </div>
  );
}
