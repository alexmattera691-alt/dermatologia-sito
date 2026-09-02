import { MapPin, Phone, Mail, Clock, Globe, Share2, MessageSquare } from "lucide-react"

const navLinks = [
  { label: "Philosophy", href: "#philosophy" },
  { label: "Process", href: "#process" },
  { label: "Treatments", href: "#treatments" },
  { label: "Technology", href: "#technology" },
  { label: "Specialists", href: "#specialists" },
  { label: "FAQ", href: "#faq" },
  { label: "Book", href: "#booking" },
]

const legalLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"]

export function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer
      data-nav-theme="dark"
      className="bg-foreground text-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-2xl font-light tracking-tight">
              Lumière Dermatology
            </h3>
            <p className="mt-4 max-w-xs text-body-sm text-background/50">
              Aesthetic & medical dermatology, grounded in clinical precision and delivered with warmth.
            </p>
            <div className="mt-6 flex gap-3">
              {[Globe, Share2, MessageSquare].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-background/20 transition-colors hover:bg-background/10"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3">
            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-background/40 uppercase">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-5">
            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-background/40 uppercase">
              Visit Us
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm text-background/60">
                  128 Harley Street, London W1G 7JR, United Kingdom
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+442071234567" className="text-sm text-background/60 transition-colors hover:text-background">
                  +44 20 7123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href="mailto:hello@lumierederm.com" className="text-sm text-background/60 transition-colors hover:text-background">
                  hello@lumierederm.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div className="text-sm text-background/60">
                  <p>Mon – Fri: 8:00 AM – 6:00 PM</p>
                  <p>Sat: 9:00 AM – 2:00 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} Lumière Dermatology. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-background/40 transition-colors hover:text-background/70"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
