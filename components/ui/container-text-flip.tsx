"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ContainerTextFlip({ words }: { words: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 2000) // Change word every 2 seconds

    return () => clearInterval(interval)
  }, [words.length])

  // Find the longest word to set a consistent width
  const maxWidth = Math.max(...words.map(word => word.length)) * 10 + 'px'

  return (
    <div className="inline-flex flex-col items-center justify-center" style={{ minWidth: maxWidth, height: '1.5em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center w-full text-center"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
