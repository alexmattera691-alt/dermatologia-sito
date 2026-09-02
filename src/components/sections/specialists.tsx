import { useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Plus } from "lucide-react"
import { useSpecialists } from "@/lib/hooks"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Specialists() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { specialists } = useSpecialists()

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReducedMotion) return

      const ctx = gsap.context(() => {
        gsap.from("[data-specialist-heading]", {
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

        gsap.from("[data-specialist-card]", {
          y: 60,
          opacity: 0,
          filter: "blur(6px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "[data-specialist-grid]",
            start: "top 75%",
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
      id="specialists"
      data-nav-theme="light"
      className="bg-background px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Specialists
        </p>
        <h2
          data-specialist-heading
          className="font-display text-display-md font-light tracking-tight text-foreground"
        >
          Expert hands.
          <br />
          <span className="text-foreground-muted">Trusted care.</span>
        </h2>

        <div
          data-specialist-grid
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {specialists.map((s) => (
            <SpecialistCard key={s.id} specialist={s} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SpecialistCard({
  specialist,
}: {
  specialist: {
    id: string
    name: string
    title: string
    specialty: string
    bio: string | null
    photo_url: string | null
  }
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      data-specialist-card
      className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-soft-sm transition-all duration-500 hover:shadow-soft-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={specialist.photo_url || "/images/specialists/placeholder.jpg"}
          alt={specialist.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-display text-lg font-medium tracking-tight text-white">
            {specialist.name}
          </h3>
          <p className="text-sm text-white/70">{specialist.title}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm font-medium text-primary">{specialist.specialty}</p>
        <div
          className={cn(
            "overflow-hidden transition-all duration-500",
            expanded ? "mt-3 max-h-40 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <p className="text-body-sm text-foreground-muted">{specialist.bio}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-primary"
        >
          <Plus
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              expanded && "rotate-45"
            )}
          />
          {expanded ? "Less" : "Read bio"}
        </button>
      </div>
    </div>
  )
}
