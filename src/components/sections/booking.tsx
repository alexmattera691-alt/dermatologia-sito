import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check, ChevronLeft, ChevronRight, Calendar, Clock, User, Stethoscope } from "lucide-react"
import { useTreatments, useSpecialists, useAvailability, createBooking } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const bookingSchema = z.object({
  patient_name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  notes: z.string().optional(),
})

type BookingForm = z.infer<typeof bookingSchema>

const steps = ["Service", "Specialist", "Date & Time", "Your Info", "Confirm"]

export function Booking() {
  const { treatments } = useTreatments()
  const { specialists } = useSpecialists()

  const [step, setStep] = useState(0)
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null)
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{ id: string; time: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const { slots, loading: slotsLoading } = useAvailability(selectedSpecialist, selectedDate)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { patient_name: "", email: "", phone: "", notes: "" },
  })

  const formData = watch()

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const canProceed = () => {
    if (step === 0) return !!selectedTreatment
    if (step === 1) return !!selectedSpecialist
    if (step === 2) return !!selectedSlot
    if (step === 3) return !errors.patient_name && !errors.email && !errors.phone && !!formData.patient_name && !!formData.email && !!formData.phone
    return true
  }

  // Generate next 14 available dates
  const availableDates = (() => {
    const dates: { value: string; label: string; day: string }[] = []
    const today = new Date()
    for (let i = 1; i <= 21; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() + i)
      const day = d.getDay()
      if (day === 0 || day === 6) continue
      dates.push({
        value: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
      })
    }
    return dates.slice(0, 10)
  })()

  const onSubmit = async (data: BookingForm) => {
    if (!selectedTreatment || !selectedSpecialist || !selectedSlot) return

    setSubmitting(true)
    try {
      await createBooking({
        treatment_name: selectedTreatment,
        specialist_id: selectedSpecialist,
        slot_id: selectedSlot.id,
        appointment_date: selectedDate,
        appointment_time: selectedSlot.time,
        patient_name: data.patient_name,
        email: data.email,
        phone: data.phone,
        notes: data.notes || null,
      })
      setConfirmed(true)
      toast.success("Your consultation has been booked. We'll be in touch shortly.")
    } catch (err) {
      toast.error("Something went wrong. Please try again or call us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = () => {
    handleSubmit(onSubmit)()
  }

  if (confirmed) {
    return (
      <section
        id="booking"
        data-nav-theme="light"
        className="bg-background-alt px-6 py-24 sm:px-12 md:py-32"
      >
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent/20"
          >
            <Check className="h-10 w-10 text-accent" />
          </motion.div>
          <h2 className="mt-8 font-display text-display-sm font-light tracking-tight text-foreground">
            Your consultation is booked.
          </h2>
          <p className="mt-4 text-body-lg text-foreground-muted">
            We've received your request for <strong className="text-foreground">{selectedTreatment}</strong> on{" "}
            <strong className="text-foreground">{selectedDate}</strong> at{" "}
            <strong className="text-foreground">{selectedSlot?.time}</strong>. Our team will confirm your appointment via email within 24 hours.
          </p>
          <Button
            onClick={() => {
              setConfirmed(false)
              setStep(0)
              setSelectedTreatment(null)
              setSelectedSpecialist(null)
              setSelectedDate(null)
              setSelectedSlot(null)
            }}
            variant="outline"
            className="mt-8"
          >
            Book another appointment
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      id="booking"
      data-nav-theme="light"
      className="bg-background-alt px-6 py-24 sm:px-12 md:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-xs font-medium tracking-[0.3em] text-primary uppercase">
          Book a Consultation
        </p>
        <h2 className="font-display text-display-md font-light tracking-tight text-foreground">
          Your journey
          <br />
          <span className="text-foreground-muted">begins here.</span>
        </h2>

        {/* Step indicator */}
        <div className="mt-12 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-300",
                  i < step && "bg-accent text-accent-foreground",
                  i === step && "bg-primary text-primary-foreground",
                  i > step && "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  i <= step ? "text-foreground" : "text-foreground-subtle"
                )}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 transition-colors duration-300",
                    i < step ? "bg-accent" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mt-12 min-h-[300px]">
          <AnimatePresence mode="wait">
            {/* Step 0: Service */}
            {step === 0 && (
              <motion.div
                key="service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="mb-6 font-display text-xl font-light text-foreground">
                  Select a treatment
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {treatments.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTreatment(t.name)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-300",
                        selectedTreatment === t.name
                          ? "border-primary bg-primary/5 shadow-soft-sm"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div>
                        <p className="font-medium text-foreground">{t.name}</p>
                        <p className="text-sm text-foreground-muted">{t.duration}</p>
                      </div>
                      {selectedTreatment === t.name && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Specialist */}
            {step === 1 && (
              <motion.div
                key="specialist"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="mb-6 font-display text-xl font-light text-foreground">
                  Choose your specialist
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {specialists.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSpecialist(s.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300",
                        selectedSpecialist === s.id
                          ? "border-primary bg-primary/5 shadow-soft-sm"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-sm text-foreground-muted">{s.specialty}</p>
                      </div>
                      {selectedSpecialist === s.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <motion.div
                key="datetime"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="mb-6 font-display text-xl font-light text-foreground">
                  Select a date
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {availableDates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => {
                        setSelectedDate(d.value)
                        setSelectedSlot(null)
                      }}
                      className={cn(
                        "flex min-w-[80px] flex-col items-center gap-1 rounded-xl border p-3 transition-all duration-300",
                        selectedDate === d.value
                          ? "border-primary bg-primary/5 shadow-soft-sm"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <span className="text-xs text-foreground-muted">{d.day}</span>
                      <span className="font-display text-lg font-light text-foreground">{d.label}</span>
                    </button>
                  ))}
                </div>

                {selectedDate && (
                  <>
                    <h4 className="mt-8 mb-4 font-display text-lg font-light text-foreground">
                      Available times
                    </h4>
                    {slotsLoading ? (
                      <div className="flex items-center gap-2 text-foreground-muted">
                        <Clock className="h-4 w-4 animate-spin" />
                        Loading available times...
                      </div>
                    ) : slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSlot({ id: slot.id, time: slot.time })}
                            className={cn(
                              "rounded-lg border py-2.5 text-center text-sm font-medium transition-all duration-300",
                              selectedSlot?.id === slot.id
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card hover:border-primary/50"
                            )}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground-muted">
                        No times available on this date. Please select another date.
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Step 3: Patient Info */}
            {step === 3 && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="mb-6 font-display text-xl font-light text-foreground">
                  Your contact details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Full name
                    </label>
                    <Input
                      {...register("patient_name")}
                      placeholder="Jane Doe"
                      aria-invalid={!!errors.patient_name}
                    />
                    {errors.patient_name && (
                      <p className="mt-1 text-sm text-destructive">{errors.patient_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="jane@example.com"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <Input
                      {...register("phone")}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Notes (optional)
                    </label>
                    <Textarea
                      {...register("notes")}
                      placeholder="Anything you'd like us to know? Please do not include sensitive health information."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="mb-6 font-display text-xl font-light text-foreground">
                  Review your appointment
                </h3>
                <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-foreground-muted">Patient</p>
                      <p className="font-medium text-foreground">{formData.patient_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-foreground-muted">Treatment</p>
                      <p className="font-medium text-foreground">{selectedTreatment}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-foreground-muted">Date</p>
                      <p className="font-medium text-foreground">
                        {selectedDate} at {selectedSlot?.time}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-foreground-muted">Contact</p>
                    <p className="font-medium text-foreground">{formData.email} · {formData.phone}</p>
                  </div>
                  {formData.notes && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-foreground-muted">Notes</p>
                      <p className="text-sm text-foreground">{formData.notes}</p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-xs text-foreground-subtle">
                  By confirming, you agree to our cancellation policy. We'll send a confirmation email within 24 hours.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="gap-1"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={submitting}
              className="gap-1"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
