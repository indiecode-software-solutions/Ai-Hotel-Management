-- Migration: Add UI-specific columns to rooms table
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS vibe text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS rating numeric,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;

-- Update status constraint
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_status_check;
ALTER TABLE public.rooms ADD CONSTRAINT rooms_status_check CHECK (status IN ('available', 'maintenance', 'booked'));

-- Seed: Populate with Mock Properties for testing
-- Note: Using UPSERT logic if possible, or just INSERT
INSERT INTO public.rooms (type, title, base_price, capacity, amenities, status, location, image_url, vibe, description, rating, latitude, longitude)
VALUES 
('Suite', 'Raj Mahal', 24500, 2, '["Heritage View", "Infinity Pool", "Ayurvedic Spa"]', 'available', 'Orchha, Madhya Pradesh', 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80', 'Heritage', 'A grand suite overlooking the heritage monuments of Orchha.', 4.9, 25.3500, 78.6400),
('Standard', 'Raj Vila', 18200, 2, '["Lush Gardens", "Private Plunge Pool", "Riverside Yoga"]', 'available', 'Orchha, Madhya Pradesh', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80', 'Nature', 'Cozy rooms surrounded by lush greenery and private pools.', 4.8, 25.3520, 78.6420),
('Deluxe', 'Raj Mahal The Palace', 32890, 4, '["Royal Suite", "Fine Dining", "Elite Butler"]', 'available', 'Orchha, Madhya Pradesh', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80', 'Heritage', 'The pinnacle of luxury with elite butler service.', 4.9, 25.3510, 78.6410),
('Standard', 'Betwa Retreat', 12500, 2, '["River View", "Tent Stay", "Cultural Walk"]', 'available', 'Orchha, Madhya Pradesh', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80', 'Nature', 'Riverside retreat offering a blend of nature and culture.', 4.6, 25.3490, 78.6380),
('Suite', 'Sheesh Mahal', 22000, 2, '["Palace Decor", "Museum Access", "Royal Dining"]', 'available', 'Orchha, Madhya Pradesh', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80', 'Heritage', 'Live like royalty in this historic palace wing.', 4.7, 25.3505, 78.6405),
('Deluxe', 'Bundelkhand Riverside', 28480, 2, '["Riverfront", "Private Ghat", "History Tours"]', 'available', 'Orchha, Madhya Pradesh', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&q=80', 'Heritage', 'Breathtaking riverfront views with private access to the ghats.', 4.8, 25.3480, 78.6370);
