import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const journey = [
  {
    phase: "First Visit",
    title: "Your first consultation",
    desc: "A warm welcome, a thorough conversation, and a complete skin history review. No rush — we listen first.",
  },
  {
    phase: "Diagnosis",
    title: "Precision assessment",
    desc: "Dermoscopy, digital imaging, and if needed, biopsy. We leave nothing to assumption.",
  },
  {
    phase: "Treatment Plan",
    title: "Your personalized roadmap",
    desc: "A clear, written plan with timelines, expected outcomes, and transparent pricing — no surprises.",
  },
  {
    phase: "Results & Maintenance",
    title: "Ongoing partnership",
    desc: "Scheduled follow-ups, progress tracking, and long-term skin health maintenance — because skin is lifelong.",
  },
]

export function SkinJourney() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReducedMotion) return

      const ctx = gsap.context(() => {
        gsap.from("[data-journey-heading]", {
          y: 40,
          opacity: 0,
          filter: "blur(8px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        })

        gsap.from("[data-journey-item]", {
          y: 60,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: "[data-journey-track]",
            start: "top 75%",
          },
        })

        // Progress line draw
        gsap.fromTo(
          "[data-journey-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-journey-track]",
              start: "top 70%",
              end: "bottom 70%",
              scrub: 1,
            },
          }
        )
      }, containerRef)

      return () => ctx.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="journey"
      data-nav-theme="light"
      className="bg-background-alt px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Your Skin Journey
        </p>
        <h2
          data-journey-heading
          className="font-display text-display-md font-light tracking-tight text-foreground"
        >
          From first visit
          <br />
          <span className="text-foreground-muted">to lasting health.</span>
        </h2>

        <div data-journey-track className="relative mt-16 pl-8 sm:pl-12">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border sm:left-4">
            <div
              data-journey-line
              className="h-full w-full origin-top bg-primary"
            />
          </div>

          <div className="space-y-12">
            {journey.map((item, i) => (
              <div key={i} data-journey-item className="relative">
                <div className="absolute -left-[1.95rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background sm:-left-[2.45rem]" />
                <p className="mb-2 text-xs font-medium tracking-[0.2em] text-primary uppercase">
                  {item.phase}
                </p>
                <h3 className="font-display text-2xl font-light tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-lg text-body text-foreground-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
