import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const faqs = [
  {
    q: "What should I expect at my first visit?",
    a: "Your first consultation lasts 45–60 minutes. We'll review your full skin history, discuss your concerns, and perform a thorough skin examination. If needed, we'll use dermoscopy for a closer look. You'll leave with a clear understanding of next steps — no pressure, no rushed decisions.",
  },
  {
    q: "How does pricing and insurance work?",
    a: "Medical dermatology consultations may be covered by your insurance. Aesthetic treatments are typically out-of-pocket. We provide transparent pricing before any treatment begins, and our team can help you understand your coverage. You will never receive an unexpected bill.",
  },
  {
    q: "What does dermoscopy involve?",
    a: "Dermoscopy is a painless, non-invasive imaging technique. We use a handheld device with polarized light to examine skin lesions at high magnification. It takes only a few minutes and provides critical diagnostic information that isn't visible to the naked eye.",
  },
  {
    q: "What aftercare is needed for aesthetic treatments?",
    a: "Aftercare depends on the treatment. Laser resurfacing requires a few days of gentle skincare and sun avoidance. Chemical peels may involve mild flaking for 3–5 days. We provide detailed, written aftercare instructions for every procedure and are available by phone if you have questions.",
  },
  {
    q: "How is my medical data protected?",
    a: "We follow strict data protection protocols in compliance with healthcare privacy regulations. Your medical records are stored securely, accessed only by your care team, and never shared without your explicit consent. Booking data is kept minimal — we collect only what's needed to schedule your appointment.",
  },
  {
    q: "Can I book for my child?",
    a: "Yes. Dr. Sofia Nakamura specializes in pediatric dermatology. We see patients of all ages, and our clinic is designed to be welcoming and calming for children. Please mention your child's age when booking so we can allocate appropriate time.",
  },
]

export function FAQ() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReducedMotion) return

      const ctx = gsap.context(() => {
        gsap.from("[data-faq-heading]", {
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

        gsap.from("[data-faq-item]", {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: "[data-faq-list]",
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
      id="faq"
      data-nav-theme="light"
      className="bg-background px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-xs font-medium tracking-[0.3em] text-primary uppercase">
          FAQ
        </p>
        <h2
          data-faq-heading
          className="font-display text-display-md font-light tracking-tight text-foreground"
        >
          Questions,
          <br />
          <span className="text-foreground-muted">answered.</span>
        </h2>

        <div data-faq-list className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border"
                data-faq-item
              >
                <AccordionTrigger className="text-left font-display text-lg font-light text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-body text-foreground-muted">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
