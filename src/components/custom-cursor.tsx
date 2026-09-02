import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let rafId: number

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) setIsVisible(true)

      const target = e.target as HTMLElement
      const isInteractive =
        target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='pointer']") !== null
      setIsPointer(isInteractive)

      if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    function onMouseLeave() {
      setIsVisible(false)
    }

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      rafId = requestAnimationFrame(animateRing)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseleave", onMouseLeave)
    rafId = requestAnimationFrame(animateRing)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseleave", onMouseLeave)
      cancelAnimationFrame(rafId)
    }
  }, [isVisible])

  if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  return (
    <>
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ marginLeft: "-4px", marginTop: "-4px" }}
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9998] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 transition-all duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isPointer ? "scale-150 border-primary/60" : "scale-100"}`}
        style={{ marginLeft: "-16px", marginTop: "-16px" }}
      />
    </>
  )
}
