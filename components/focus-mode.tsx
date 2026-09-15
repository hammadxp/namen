"use client"

import { useEffect } from "react"

export function FocusMode() {
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab")
        document.documentElement.classList.add("keyboard-nav")
    }
    const pointer = () =>
      document.documentElement.classList.remove("keyboard-nav")
    window.addEventListener("keydown", keyboard)
    window.addEventListener("pointerdown", pointer)
    return () => {
      window.removeEventListener("keydown", keyboard)
      window.removeEventListener("pointerdown", pointer)
    }
  }, [])
  return null
}
