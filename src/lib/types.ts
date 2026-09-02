export type TreatmentCategory = "medical" | "aesthetic"

export interface Treatment {
  id: string
  name: string
  category: TreatmentCategory
  tagline: string | null
  description: string | null
  duration: string | null
  image_url: string | null
  sort_order: number
}

export interface Specialist {
  id: string
  name: string
  title: string
  specialty: string
  bio: string | null
  photo_url: string | null
  sort_order: number
}

export interface AvailabilitySlot {
  id: string
  specialist_id: string
  date: string
  time: string
  is_booked: boolean
}

export interface Booking {
  id: string
  treatment_name: string
  specialist_id: string | null
  slot_id: string | null
  appointment_date: string | null
  appointment_time: string | null
  patient_name: string
  email: string
  phone: string
  notes: string | null
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
}
