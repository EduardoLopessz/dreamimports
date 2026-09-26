"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { ApiProvider } from "@/lib/trpc";
import { useCart, useFavorites } from "@/store/cart";

export function Providers({ children }: { children: ReactNode }) {
  // Os stores persistem no navegador; reidratamos depois de montar para não quebrar o SSR.
  useEffect(() => {
    useCart.persist.rehydrate();
    useFavorites.persist.rehydrate();
  }, []);

  return (
    <ApiProvider>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user" transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.6 }}>
          {children}
          <Toaster position="bottom-center" toastOptions={{ className: "font-sans" }} />
        </MotionConfig>
      </LazyMotion>
    </ApiProvider>
  );
}
