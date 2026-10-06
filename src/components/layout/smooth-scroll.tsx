"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: Lenis | undefined;
    let frame = 0;

    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
    };

    const start = () => {
      stop();

      if (media.matches) return;

      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        anchors: true
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };

      frame = requestAnimationFrame(raf);
    };

    start();
    media.addEventListener("change", start);

    return () => {
      stop();
      media.removeEventListener("change", start);
    };
  }, []);

  return null;
}
