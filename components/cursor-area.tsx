"use client"

import { ReactNode, useEffect, useRef, useState } from "react"

export default function CursorArea({ children }: { children: ReactNode }) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isPointerFine, setIsPointerFine] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if the device has a fine pointer (mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)")
    setIsPointerFine(mediaQuery.matches)

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches)
    }

    mediaQuery.addEventListener("change", handleMediaChange)
    return () => mediaQuery.removeEventListener("change", handleMediaChange)
  }, [])

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current || !isPointerFine) return

    const rect = containerRef.current.getBoundingClientRect()
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handlePointerEnter = () => {
    if (isPointerFine) {
      setIsVisible(true)
    }
  }

  const handlePointerLeave = () => {
    setIsVisible(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        cursor: isPointerFine && isVisible ? "none" : "auto",
      }}
    >
      {children}
      
      {/* Custom cursor */}
      {isPointerFine && isVisible && (
        <img
          src="/images/cursor.png"
          alt="Custom cursor"
          className="pointer-events-none absolute z-50 h-6 w-6"
          style={{
            left: cursorPosition.x - 12, // Center the cursor
            top: cursorPosition.y - 12,
            transform: "translate(0, 0)", // Prevent sub-pixel rendering issues
          }}
          onError={(e) => {
            console.error("Custom cursor image failed to load:", "/images/cursor.png")
            // Fallback: hide custom cursor if image fails to load
            setIsVisible(false)
          }}
          onLoad={() => {
            console.log("Custom cursor image loaded successfully")
          }}
        />
      )}
    </div>
  )
}