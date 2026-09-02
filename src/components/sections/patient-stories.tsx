import { useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight, Quote } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const testimonials = [
  {
    quote:
      "After years of being dismissed about my acne, Dr. Marchetti took the time to actually look at my skin — not just prescribe. The personalized plan changed everything. I finally feel comfortable without foundation.",
    author: "Maria K.",
    context: "Acne treatment patient",
  },
  {
    quote:
      "The mole mapping technology caught a change I never would have noticed. It turned out to be early-stage, completely treatable. I owe my health to this clinic's thoroughness.",
    author: "David R.",
    context: "Skin cancer screening patient",
  },
  {
    quote:
      "I was nervous about laser resurfacing. Dr. Whitfield explained every step, showed me realistic outcomes, and never overpromised. The results are subtle and natural — exactly what I wanted.",
    author: "Priya S.",
    context: "Laser resurfacing patient",
  },
  {
    quote:
      "My daughter's eczema was affecting her sleep and school. Dr. Nakamura's gentle, pediatric approach made all the difference. For the first time in two years, her skin is calm.",
    author: "Theresa L.",
    context: "Pediatric dermatology parent",
  },
  {
    quote:
      "As a woman of color, I struggled to find a dermatologist who understood my skin. Dr. Okafor's expertise in pigmentation disorders was transformative. My melasma has visibly improved.",
    author: "Aisha M.",
    context: "Pigmentary disorder patient",
  },
]

export function PatientStories() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" })

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReducedMotion) return

      const ctx = gsap.context(() => {
        gsap.from("[data-stories-heading]", {
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
      }, containerRef)

      return () => ctx.revert()
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      id="stories"
      data-nav-theme="light"
      className="bg-background-alt px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-6 text-xs font-medium tracking-[0.3em] text-primary uppercase">
              Patient Stories
            </p>
            <h2
              data-stories-heading
              className="font-display text-display-md font-light tracking-tight text-foreground"
            >
              Real experiences.
              <br />
              <span className="text-foreground-muted">Real outcomes.</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="min-w-[85%] flex-shrink-0 pr-6 sm:min-w-[50%] lg:min-w-[33.33%]"
              >
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-8 shadow-soft-sm">
                  <Quote className="h-8 w-8 text-primary/30" />
                  <p className="mt-4 flex-1 text-body-lg leading-relaxed text-foreground">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="font-display text-lg font-medium text-foreground">
                      {t.author}
                    </p>
                    <p className="text-sm text-foreground-muted">{t.context}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-foreground-subtle">
          * Testimonials are illustrative. The client must supply and approve
          all patient testimonials before publishing for medical-advertising
          compliance.
        </p>
      </div>
    </section>
  )
}
