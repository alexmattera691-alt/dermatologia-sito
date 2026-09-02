import { SmoothScroll } from "@/components/smooth-scroll"
import { CustomCursor } from "@/components/custom-cursor"
import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { Philosophy } from "@/components/sections/philosophy"
import { Process } from "@/components/sections/process"
import { Treatments } from "@/components/sections/treatments"
import { SkinJourney } from "@/components/sections/skin-journey"
import { Technology } from "@/components/sections/technology"
import { Specialists } from "@/components/sections/specialists"
import { PatientStories } from "@/components/sections/patient-stories"
import { FAQ } from "@/components/sections/faq"
import { Booking } from "@/components/sections/booking"
import { Footer } from "@/components/sections/footer"

export function App() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Process />
        <Treatments />
        <SkinJourney />
        <Technology />
        <Specialists />
        <PatientStories />
        <FAQ />
        <Booking />
      </main>
      <Footer />
    </SmoothScroll>
  )
}

export default App
