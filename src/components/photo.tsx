import Image from "next/image";
import { BLUR } from "@/db/blur";
import type { ProductImage } from "@/db/schema";
import { cn, pexels } from "@/lib/utils";

type Props = {
  image: Pick<ProductImage, "pexelsId" | "alt" | "focus">;
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Foto principal da tela (LCP): começa a baixar já no <head>. */
  priority?: boolean;
  imgStyle?: React.CSSProperties;
};

/**
 * Foto real do Pexels, preenchendo o container. Enquanto a foto baixa, aparece uma
 * miniatura desfocada dela mesma (menos de 1 KB, já no HTML), então nunca fica um buraco cinza.
 */
export function Photo({ image, sizes, className, imgClassName, priority, imgStyle }: Props) {
  const blur = BLUR[image.pexelsId];
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      <Image
        src={pexels(image.pexelsId)}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={priority}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        className={cn("object-cover text-transparent", imgClassName)}
        style={{ objectPosition: image.focus ?? "50% 30%", ...imgStyle }}
      />
    </div>
  );
}
