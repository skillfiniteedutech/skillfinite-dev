"use client"

import type React from "react"
import { useEffect } from "react"

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // DO NOTHING if the element being clicked is the target element or their children
      if (!ref.current || (event.target instanceof Node && ref.current.contains(event.target))) {
        return
      }
      callback(event)
    }

    document.addEventListener("mousedown", listener as EventListener)
    document.addEventListener("touchstart", listener as EventListener)

    return () => {
      document.removeEventListener("mousedown", listener as EventListener)
      document.removeEventListener("touchstart", listener as EventListener)
    }
  }, [ref, callback])
}
