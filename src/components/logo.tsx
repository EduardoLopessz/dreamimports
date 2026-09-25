import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <path d="M22.5 25.8A13 13 0 1 1 17.2 3.1a10.5 10.5 0 1 0 5.3 22.7Z" fill="currentColor" />
      <circle cx="25.5" cy="6.5" r="2.5" fill="var(--color-accent)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Dream Store, página inicial" className={cn("flex items-center gap-2", className)}>
      <LogoMark className="size-6 sm:size-7" />
      <span className="display text-2xl leading-none sm:text-3xl">
        Dream<span className="ml-1.5 text-accent">Store</span>
      </span>
    </Link>
  );
}
