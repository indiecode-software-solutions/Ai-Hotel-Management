-- Migration: Add payment_id to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_id text;

-- Optional: Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_id ON public.bookings(payment_id);
