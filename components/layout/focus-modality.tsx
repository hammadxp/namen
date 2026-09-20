"use client";

import { useEffect } from "react";

export function FocusModality() {
  useEffect(() => {
    const root = document.documentElement;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Tab") root.dataset.keyboardFocus = "true";
    }

    function onPointerDown() {
      delete root.dataset.keyboardFocus;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}
