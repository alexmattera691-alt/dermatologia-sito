import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ArrowUpRight } from "lucide-react"
import { useTreatments } from "@/lib/hooks"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Treatments() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { treatments } = useTreatments()

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReducedMotion) return

      const ctx = gsap.context(() => {
        gsap.from("[data-treatment-card]", {
          y: 60,
          opacity: 0,
          filter: "blur(8px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "[data-treatment-grid]",
            start: "top 75%",
          },
        })

        gsap.from("[data-treatment-heading]", {
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

  const medical = treatments.filter((t) => t.category === "medical")
  const aesthetic = treatments.filter((t) => t.category === "aesthetic")

  const handleBookClick = () => {
    const el = document.querySelector("#booking")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={containerRef}
      id="treatments"
      data-nav-theme="light"
      className="bg-background px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div data-treatment-heading>
          <p className="mb-6 text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Treatments
          </p>
          <h2 className="font-display text-display-md font-light tracking-tight text-foreground">
            Medical expertise.
            <br />
            <span className="text-foreground-muted">Aesthetic refinement.</span>
          </h2>
        </div>

        {/* Medical Dermatology */}
        <div className="mt-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-display text-xl font-light tracking-tight text-foreground">
              Medical Dermatology
            </h3>
            <div className="gold-line h-px flex-1" />
          </div>
          <div
            data-treatment-grid
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {medical.map((t) => (
              <TreatmentCard key={t.id} treatment={t} onBook={handleBookClick} />
            ))}
          </div>
        </div>

        {/* Aesthetic Dermatology */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-display text-xl font-light tracking-tight text-foreground">
              Aesthetic Dermatology
            </h3>
            <div className="gold-line h-px flex-1" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aesthetic.map((t) => (
              <TreatmentCard key={t.id} treatment={t} onBook={handleBookClick} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TreatmentCard({
  treatment,
  onBook,
}: {
  treatment: {
    id: string
    name: string
    tagline: string | null
    description: string | null
    duration: string | null
    image_url: string | null
  }
  onBook: () => void
}) {
  return (
    <div
      data-treatment-card
      onClick={onBook}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft-sm transition-all duration-500 hover:shadow-soft-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={treatment.image_url || "/images/treatments/placeholder.jpg"}
          alt={treatment.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-lg font-medium tracking-tight text-foreground">
            {treatment.name}
          </h4>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground-muted transition-all duration-300 group-hover:text-primary group-hover:rotate-0" />
        </div>
        {treatment.tagline && (
          <p className="mt-1 text-sm font-medium text-primary">
            {treatment.tagline}
          </p>
        )}
        {treatment.description && (
          <p className="mt-3 text-body-sm text-foreground-muted">
            {treatment.description}
          </p>
        )}
        {treatment.duration && (
          <p className="mt-4 text-xs tracking-wider text-foreground-subtle uppercase">
            {treatment.duration}
          </p>
        )}
      </div>
    </div>
  )
}
