import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const stats = [
  { value: 15, suffix: "+", label: "Years of practice" },
  { value: 12000, suffix: "+", label: "Patients treated" },
  { value: 98, suffix: "%", label: "Patient satisfaction" },
]

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
      el.textContent = `${value.toLocaleString()}${suffix}`
      return
    }

    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = `${Math.round(obj.val).toLocaleString()}${suffix}`
      },
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    })
  }, [value, suffix])

  return (
    <div>
      <div
        ref={ref}
        className="font-display text-4xl font-light text-foreground sm:text-5xl"
      >
        0{suffix}
      </div>
      <p className="mt-2 text-sm text-foreground-muted">{label}</p>
    </div>
  )
}

export function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReducedMotion) return

      const ctx = gsap.context(() => {
        gsap.from("[data-philosophy-line]", {
          y: 60,
          opacity: 0,
          filter: "blur(10px)",
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        })

        gsap.from("[data-philosophy-body]", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          },
        })

        gsap.from("[data-philosophy-stat]", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: "[data-philosophy-stats]",
            start: "top 80%",
          },
        })

        gsap.from("[data-philosophy-image]", {
          scale: 1.1,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-philosophy-image]",
            start: "top 85%",
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
      id="philosophy"
      data-nav-theme="light"
      className="relative bg-background px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: text */}
          <div className="lg:col-span-7">
            <p className="mb-6 text-xs font-medium tracking-[0.3em] text-primary uppercase">
              Our Philosophy
            </p>
            <h2 className="font-display text-display-lg font-light leading-[1.05] tracking-tight text-foreground">
              <span data-philosophy-line className="block">Skin is not vanity.</span>
              <span data-philosophy-line className="block text-foreground-muted">
                Skin is health.
              </span>
            </h2>
            <div className="mt-8 max-w-xl space-y-5">
              <p data-philosophy-body className="text-body-lg text-foreground-muted">
                We believe dermatology begins with diagnosis, not aesthetics.
                Every treatment plan starts with a thorough understanding of your
                skin's unique biology — because lasting radiance is built on
                clinical precision, not trends.
              </p>
              <p data-philosophy-body className="text-body-lg text-foreground-muted">
                Our approach is evidence-based and patient-centered. We combine
                advanced diagnostic technology with a warm, unhurried consultation
                process — so you leave not just treated, but understood.
              </p>
            </div>
          </div>

          {/* Right: image */}
          <div className="lg:col-span-5">
            <div
              data-philosophy-image
              className="aspect-[3/4] overflow-hidden rounded-2xl shadow-soft-lg"
            >
              <img
                src="/philosophy-dermatology.webp"
                alt="Clinical dermatology consultation"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          data-philosophy-stats
          className="mt-20 grid grid-cols-1 gap-8 border-t border-border pt-12 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div data-philosophy-stat key={stat.label}>
              <StatCounter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-foreground-subtle">
          * Placeholder statistics. The client must replace these with real,
          verifiable data before publishing.
        </p>
      </div>
    </section>
  )
}
