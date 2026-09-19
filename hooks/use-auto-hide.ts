"use client";

import { useEffect, useState } from "react";

export function useAutoHideOnScroll() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const current = window.scrollY;
        const distance = current - previous;
        if (Math.abs(distance) > 8) setHidden(distance > 0 && current > 260);
        previous = current;
        frame = 0;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return hidden;
}
