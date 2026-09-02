import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const heroPhrases = [
  { text: "Skin is not vanity.", sub: "Skin is health.", align: "left" },
  { text: "Precision", sub: "in every diagnosis.", align: "right" },
  { text: "Radiance,", sub: "restored.", align: "center" },
  { text: "Book your", sub: "consultation.", align: "left" },
]

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      if (prefersReducedMotion) {
        gsap.set("[data-hero-phrase]", { opacity: 1, y: 0, filter: "blur(0px)" })
        return
      }

      const ctx = gsap.context(() => {
        // Cinematic zoom on the image as user scrolls
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scale: 1.35,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
        }

        // Overlay darkening
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            opacity: 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          })
        }

        // Phrase reveals at different scroll segments
        const phrases = gsap.utils.toArray<HTMLElement>("[data-hero-phrase]")
        phrases.forEach((phrase, i) => {
          const seg = 1 / phrases.length
          const start = i * seg
          const end = start + seg

          if (i === 0) {
            gsap.set(phrase, { opacity: 1, y: 0, filter: "blur(0px)" })
          } else {
            gsap.fromTo(
              phrase,
              { opacity: 0, y: 40, filter: "blur(8px)" },
              {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                ease: "power2.out",
                duration: 0.6,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: `${start * 100}% top`,
                  end: `${(start + seg * 0.5) * 100}% top`,
                  scrub: false,
                  toggleActions: "play none none reverse",
                },
              }
            )
          }

          gsap.to(phrase, {
            opacity: 0,
            y: -40,
            filter: "blur(8px)",
            ease: "power2.in",
            duration: 0.6,
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${end * 100}% top`,
              end: `${(end + seg * 0.3) * 100}% top`,
              scrub: false,
              toggleActions: "play none none Reverse",
            },
          })
        })

        // Scroll progress hairline
        gsap.to("[data-scroll-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      }, containerRef)

      return () => ctx.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="top"
      data-nav-theme="dark"
      className="relative h-[300vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Hero image */}
        <div
          ref={imageRef}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage:
              "url(/hero-dermatology.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/30"
        />

        {/* Hero phrases */}
        <div className="absolute inset-0 flex flex-col">
          {heroPhrases.map((phrase, i) => (
            <div
              key={i}
              data-hero-phrase
              className={`flex h-full w-full items-center px-6 sm:px-12 md:px-20 ${
                phrase.align === "right"
                  ? "justify-end"
                  : phrase.align === "center"
                    ? "justify-center"
                    : "justify-start"
              }`}
            >
              <div className="glass rounded-2xl bg-black/20 px-6 py-5 sm:px-10 sm:py-8">
                <h1 className="font-display text-display-lg font-light text-white">
                  {phrase.text}
                </h1>
                <h2 className="font-display text-display-md font-light text-white/80">
                  {phrase.sub}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll progress hairline */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
          <div
            data-scroll-progress
            className="h-full origin-left scale-x-0 bg-white/60"
          />
        </div>

        {/* Scroll to begin */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <p className="text-xs font-light tracking-[0.3em] text-white/50 uppercase">
            Scroll to begin
          </p>
        </div>
      </div>
    </section>
  )
}
