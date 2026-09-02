import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const techFeatures = [
  {
    title: "AI-Assisted Mole Mapping",
    desc: "Our dermoscopy system uses machine learning to compare moles across visits, flagging subtle changes invisible to the human eye.",
  },
  {
    title: "High-Resolution Dermoscopy",
    desc: "Polarized and non-polarized imaging at up to 200x magnification for cellular-level diagnostic precision.",
  },
  {
    title: "Digital Skin Analysis",
    desc: "Multi-spectral imaging assesses UV damage, pigmentation depth, and vascular patterns in a single scan.",
  },
]

export function Technology() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReducedMotion) return

    let renderer: any
    let scene: any
    let camera: any
    let animationId: number
    let particles: any
    let mouseX = 0
    let mouseY = 0

    async function initThree() {
      const THREE = await import("three")
      const container = canvasRef.current
      if (!container) return

      const width = container.clientWidth
      const height = container.clientHeight

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
      camera.position.z = 8

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      const particleCount = window.innerWidth < 768 ? 1500 : 3000
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)

      const color1 = new THREE.Color("#a87a6a")
      const color2 = new THREE.Color("#8db596")
      const color3 = new THREE.Color("#c9a86a")

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const radius = 3 + Math.random() * 1.5
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i3 + 2] = radius * Math.cos(phi)

        const mix = Math.random()
        const color = mix < 0.33 ? color1 : mix < 0.66 ? color2 : color3
        colors[i3] = color.r
        colors[i3 + 1] = color.g
        colors[i3 + 2] = color.b
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      particles = new THREE.Points(geometry, material)
      scene.add(particles)

      function onMouseMove(e: MouseEvent) {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1
      }
      window.addEventListener("mousemove", onMouseMove)

      function animate() {
        animationId = requestAnimationFrame(animate)
        if (particles) {
          particles.rotation.y += 0.0015
          particles.rotation.x += 0.0005
        }
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
      }
      animate()

      function onResize() {
        if (!container || !renderer || !camera) return
        const w = container.clientWidth
        const h = container.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener("resize", onResize)

      return () => {
        window.removeEventListener("mousemove", onMouseMove)
        window.removeEventListener("resize", onResize)
        cancelAnimationFrame(animationId)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }
    }

    const cleanup = initThree()
    return () => {
      cleanup.then((fn) => fn && fn())
    }
  }, [])

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      if (prefersReducedMotion) return

      const ctx = gsap.context(() => {
        gsap.from("[data-tech-heading]", {
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

        gsap.from("[data-tech-feature]", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: "[data-tech-features]",
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
      id="technology"
      data-nav-theme="dark"
      className="relative overflow-hidden bg-foreground py-24 text-background md:py-32"
    >
      <div
        ref={canvasRef}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
        <p className="mb-6 text-xs font-medium tracking-[0.3em] text-accent uppercase">
          Technology
        </p>
        <h2
          data-tech-heading
          className="font-display text-display-md font-light tracking-tight text-background"
        >
          Precision you
          <br />
          <span className="text-background/50">can see.</span>
        </h2>

        <div
          data-tech-features
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {techFeatures.map((feature, i) => (
            <div
              key={i}
              data-tech-feature
              className="glass rounded-xl border border-background/10 bg-background/5 p-6"
            >
              <span className="font-display text-3xl font-light text-accent">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-light tracking-tight text-background">
                {feature.title}
              </h3>
              <p className="mt-3 text-body-sm text-background/60">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
