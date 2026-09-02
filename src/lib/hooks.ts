import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Treatment, Specialist, AvailabilitySlot } from "@/lib/types"
import { mockTreatments, mockSpecialists, mockTimeSlots } from "@/lib/mock-data"

export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>(mockTreatments)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      const { data, error } = await supabase
        .from("treatments")
        .select("*")
        .order("sort_order", { ascending: true })
      if (!cancelled && !error && data && data.length > 0) {
        setTreatments(data as Treatment[])
      }
      if (!cancelled) setLoading(false)
    }
    fetch()
    return () => {
      cancelled = true
    }
  }, [])

  return { treatments, loading }
}

export function useSpecialists() {
  const [specialists, setSpecialists] = useState<Specialist[]>(mockSpecialists)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      const { data, error } = await supabase
        .from("specialists")
        .select("*")
        .order("sort_order", { ascending: true })
      if (!cancelled && !error && data && data.length > 0) {
        setSpecialists(data as Specialist[])
      }
      if (!cancelled) setLoading(false)
    }
    fetch()
    return () => {
      cancelled = true
    }
  }, [])

  return { specialists, loading }
}

export function useAvailability(specialistId: string | null, date: string | null) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!specialistId || !date) {
      setSlots([])
      return
    }

    let cancelled = false
    setLoading(true)

    async function fetchSlots() {
      if (!specialistId || !date) return
      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("specialist_id", specialistId)
        .eq("date", date)
        .eq("is_booked", false)
        .order("time", { ascending: true })

      if (!cancelled && !error && data) {
        setSlots(data as AvailabilitySlot[])
      } else if (!cancelled) {
        // Fallback: generate mock slots
        setSlots(
          mockTimeSlots.map((time) => ({
            id: `mock-${specialistId}-${date}-${time}`,
            specialist_id: specialistId,
            date,
            time,
            is_booked: false,
          }))
        )
      }
      if (!cancelled) setLoading(false)
    }

    fetchSlots()
    return () => {
      cancelled = true
    }
  }, [specialistId, date])

  return { slots, loading }
}

export async function createBooking(booking: {
  treatment_name: string
  specialist_id: string | null
  slot_id: string | null
  appointment_date: string | null
  appointment_time: string | null
  patient_name: string
  email: string
  phone: string
  notes: string | null
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single()

  if (error) throw error

  // Mark the slot as booked if we have a slot_id
  if (booking.slot_id) {
    await supabase
      .from("availability_slots")
      .update({ is_booked: true })
      .eq("id", booking.slot_id)
  }

  return data
}
