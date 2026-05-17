"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const l = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      autoRaf: true,
    });
    (window as any).__lenis = l;
    return () => { l.destroy(); delete (window as any).__lenis; };
  }, []);

  return <>{children}</>;
}
