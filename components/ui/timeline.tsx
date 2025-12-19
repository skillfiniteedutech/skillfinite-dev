"use client"

import React from "react"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"

type TimelineItem = {
  title: string
  content: ReactNode
}

type TimelineProps = {
  data: TimelineItem[]
  defaultDark?: boolean
  className?: string
}

export function Timeline({ data, defaultDark = true, className }: TimelineProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(0)

  React.useEffect(() => {
    if (!contentRef.current) return
    const el = contentRef.current
    const ro = new ResizeObserver(() => {
      setHeight(el.offsetHeight)
    })
    ro.observe(el)
    // initial measurement
    setHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  })
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <section
      aria-label="Timeline"
      ref={containerRef}
      className={cn("relative w-full font-sans", defaultDark && "dark", className)}
    >
      <div ref={contentRef} className="relative mx-auto max-w-7xl pb-20">
        <ul role="list" className="m-0 list-none p-0">
          {data.map((item, index) => (
            <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
              {/* sticky left: dot + title */}
              <div className="sticky top-40 z-40 self-start md:w-full">
                <div className="relative flex flex-col items-center md:flex-row">
                  {/* outer circle container */}
                  <div className="absolute left-3 h-10 w-10 rounded-full bg-background md:left-3 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-muted border border-border" />
                  </div>
                  <h3 className="hidden md:block md:pl-20 text-xl md:text-5xl font-bold text-muted-foreground">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* right: mobile title + content */}
              <div className="relative w-full pl-20 pr-4 md:pl-4">
                <h3 className="md:hidden mb-4 block text-left text-2xl font-bold text-muted-foreground">
                  {item.title}
                </h3>
                <div className={cn("prose max-w-none prose-p:my-0", defaultDark && "prose-invert")}>{item.content}</div>
              </div>
            </div>
          ))}
        </ul>

        {/* vertical track + animated progress line */}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden
                     bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))]
                     from-transparent via-neutral-200 to-transparent
                     from-[0%] to-[99%]
                     dark:via-neutral-700
                     [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px]
                       bg-gradient-to-t from-primary/80 via-primary to-transparent
                       from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </section>
  )
}

export default Timeline
