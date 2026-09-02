/*
# Dermatology Clinic — Full Database Schema

## Overview
Creates the complete data model for a premium dermatology clinic website.
This is a single-tenant, no-auth application: anyone can browse treatments,
specialists, and availability, and submit bookings anonymously.

## New Tables

1. **treatments** — Catalog of medical and aesthetic dermatology services
   - `id` (uuid, PK)
   - `name` (text, not null) — treatment name
   - `category` (text, not null) — 'medical' or 'aesthetic'
   - `tagline` (text) — short marketing tagline
   - `description` (text) — one-line description
   - `duration` (text) — e.g. "45 min"
   - `image_url` (text) — editorial photo URL
   - `sort_order` (int, default 0) — display ordering

2. **specialists** — Dermatologist team members
   - `id` (uuid, PK)
   - `name` (text, not null)
   - `title` (text, not null) — e.g. "Medical Director"
   - `specialty` (text, not null) — e.g. "Medical & Oncological Dermatology"
   - `bio` (text) — short biography
   - `photo_url` (text) — editorial portrait URL
   - `sort_order` (int, default 0)

3. **availability_slots** — Bookable time slots per specialist
   - `id` (uuid, PK)
   - `specialist_id` (uuid, FK → specialists)
   - `date` (date, not null) — the calendar date
   - `time` (text, not null) — e.g. "09:00"
   - `is_booked` (boolean, default false) — whether this slot is taken

4. **bookings** — Patient booking submissions (anonymous, no auth)
   - `id` (uuid, PK)
   - `treatment_name` (text, not null) — selected service name
   - `specialist_id` (uuid, FK → specialists, nullable)
   - `slot_id` (uuid, FK → availability_slots, nullable)
   - `appointment_date` (date, nullable)
   - `appointment_time` (text, nullable)
   - `patient_name` (text, not null)
   - `email` (text, not null)
   - `phone` (text, not null)
   - `notes` (text, nullable) — optional patient notes (no health data)
   - `status` (text, default 'pending') — pending / confirmed / cancelled
   - `created_at` (timestamptz, default now())

## Security (RLS)
- RLS enabled on ALL tables.
- This is a no-auth, single-tenant app. All policies use `TO anon, authenticated`.
- SELECT: open to all (anyone can browse treatments, specialists, available slots).
- INSERT on bookings: open to all (anonymous booking submission with `WITH CHECK (true)`).
- UPDATE on availability_slots: open to all (marking slots as booked).
- No DELETE or UPDATE on bookings from the client (managed server-side only).

## Important Notes
1. No `user_id` columns — no auth layer in this app.
2. No sensitive health data stored in the bookings table.
3. Availability slots are generated for the next 30 days via seed data.
*/

-- Treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('medical', 'aesthetic')),
  tagline text,
  description text,
  duration text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_treatments" ON treatments;
CREATE POLICY "anon_select_treatments" ON treatments FOR SELECT
  TO anon, authenticated USING (true);

-- Specialists table
CREATE TABLE IF NOT EXISTS specialists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  specialty text NOT NULL,
  bio text,
  photo_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_specialists" ON specialists;
CREATE POLICY "anon_select_specialists" ON specialists FOR SELECT
  TO anon, authenticated USING (true);

-- Availability slots table
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id uuid NOT NULL REFERENCES specialists(id) ON DELETE CASCADE,
  date date NOT NULL,
  time text NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE (specialist_id, date, time)
);

ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_slots" ON availability_slots;
CREATE POLICY "anon_select_slots" ON availability_slots FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_slots" ON availability_slots;
CREATE POLICY "anon_update_slots" ON availability_slots FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_name text NOT NULL,
  specialist_id uuid REFERENCES specialists(id) ON DELETE SET NULL,
  slot_id uuid REFERENCES availability_slots(id) ON DELETE SET NULL,
  appointment_date date,
  appointment_time text,
  patient_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_treatments_category ON treatments(category);
CREATE INDEX IF NOT EXISTS idx_treatments_sort_order ON treatments(sort_order);
CREATE INDEX IF NOT EXISTS idx_specialists_sort_order ON specialists(sort_order);
CREATE INDEX IF NOT EXISTS idx_slots_specialist_date ON availability_slots(specialist_id, date);
CREATE INDEX IF NOT EXISTS idx_slots_is_booked ON availability_slots(is_booked);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
