import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Philosophy", href: "#philosophy" },
  { label: "Process", href: "#process" },
  { label: "Treatments", href: "#treatments" },
  { label: "Technology", href: "#technology" },
  { label: "Specialists", href: "#specialists" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [navTheme, setNavTheme] = useState<"light" | "dark">("dark")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll("section[data-nav-theme]")
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute("data-nav-theme")
            if (theme === "light" || theme === "dark") {
              setNavTheme(theme)
            }
          }
        })
      },
      { rootMargin: "-50% 0px -50% 0px" }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  const isDark = navTheme === "dark"

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo pill */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2.5 shadow-soft-md glass transition-all duration-500",
              isDark
                ? "bg-white/10 text-white"
                : "bg-white/60 text-foreground"
            )}
          >
            <span className="font-display text-lg font-medium tracking-tight">
              Lumière
            </span>
            <span
              className={cn(
                "text-xs font-light tracking-widest uppercase",
                isDark ? "text-white/60" : "text-foreground-muted"
              )}
            >
              Dermatology
            </span>
          </a>

          {/* Nav links pill */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: scrolled ? 1 : 0,
              y: scrolled ? 0 : -10,
              pointerEvents: scrolled ? "auto" : "none",
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "hidden items-center gap-1 rounded-full px-2 py-2 shadow-soft-md glass md:flex",
              isDark ? "bg-white/10" : "bg-white/60"
            )}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300",
                  isDark
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-foreground-muted hover:text-foreground hover:bg-black/5"
                )}
              >
                {link.label}
              </button>
            ))}
          </motion.nav>

          {/* CTA pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: scrolled ? 1 : 0,
              y: scrolled ? 0 : -10,
              pointerEvents: scrolled ? "auto" : "none",
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block"
          >
            <button
              onClick={() => handleNavClick("#booking")}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium shadow-soft-md transition-all duration-300",
                isDark
                  ? "bg-white text-foreground hover:bg-white/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              Book Consultation
            </button>
          </motion.div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              "flex items-center justify-center rounded-full p-2.5 shadow-soft-md glass md:hidden",
              isDark ? "bg-white/10 text-white" : "bg-white/60 text-foreground"
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background md:hidden"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="font-display text-lg font-medium">
                Lumière Dermatology
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-full border border-border p-2.5"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <motion.nav
              className="flex flex-col gap-2 px-6 pt-12"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left font-display text-3xl font-light tracking-tight text-foreground"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                onClick={() => handleNavClick("#booking")}
                className="mt-8 rounded-full bg-primary px-6 py-3.5 text-center text-sm font-medium text-primary-foreground"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                Book Consultation
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
