import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  Stethoscope,
  Microscope,
  ClipboardList,
  Sparkles,
  CalendarCheck,
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const steps = [
  {
    num: "01",
    title: "Consultation",
    desc: "A thorough, unhurried conversation about your skin history, concerns, and goals.",
    icon: Stethoscope,
  },
  {
    num: "02",
    title: "Skin Analysis",
    desc: "Advanced dermoscopy and digital imaging to assess your skin at a cellular level.",
    icon: Microscope,
  },
  {
    num: "03",
    title: "Personalized Plan",
    desc: "A tailored treatment roadmap based on your diagnosis, lifestyle, and skin type.",
    icon: ClipboardList,
  },
  {
    num: "04",
    title: "Treatment",
    desc: "Precise, evidence-based procedures performed by board-certified specialists.",
    icon: Sparkles,
  },
  {
    num: "05",
    title: "Follow-up",
    desc: "Ongoing monitoring and adjustment to ensure lasting, healthy results.",
    icon: CalendarCheck,
  },
]

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReducedMotion) return

      const ctx = gsap.context(() => {
        const track = gsap.utils.toArray<HTMLElement>("[data-process-step]")
        const totalWidth =
          (track.length - 1) * (100 / track.length)

        gsap.to(track, {
          xPercent: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 2}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })

        gsap.from("[data-process-heading]", {
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
      id="process"
      data-nav-theme="light"
      className="relative overflow-hidden bg-background-alt py-24 md:py-32"
    >
      <div className="px-6 sm:px-12">
        <p className="mb-6 text-xs font-medium tracking-[0.3em] text-primary uppercase">
          How We Work
        </p>
        <h2
          data-process-heading
          className="font-display text-display-md font-light tracking-tight text-foreground"
        >
          A diagnostic journey,
          <br />
          <span className="text-foreground-muted">not a transaction.</span>
        </h2>
      </div>

      <div className="mt-16 flex gap-6 px-6 sm:px-12 md:gap-12">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.num}
              data-process-step
              className="flex min-w-[80vw] flex-col gap-6 sm:min-w-[45vw] md:min-w-[30vw] lg:min-w-[22vw]"
            >
              <div className="flex items-center gap-4">
                <span className="font-display text-6xl font-light text-primary/30">
                  {step.num}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-2xl font-light tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-body text-foreground-muted">{step.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
