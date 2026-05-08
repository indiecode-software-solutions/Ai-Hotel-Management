-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  role text check (role in ('admin', 'guest')) default 'guest',
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.users enable row level security;

-- Users can read their own data
create policy "Users can view own profile" 
  on public.users for select 
  using ( auth.uid() = id );

-- Admins can read all users
create policy "Admins can view all users" 
  on public.users for select 
  using ( 
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );


-- 2. ROOMS TABLE (Single Hotel Inventory)
create table public.rooms (
  id uuid default uuid_generate_v4() primary key,
  type text not null, -- e.g., 'Suite', 'Standard', 'Deluxe'
  base_price numeric not null,
  capacity integer not null default 2,
  amenities jsonb default '[]'::jsonb,
  status text check (status in ('available', 'maintenance', 'booked')) default 'available',
  title text,
  location text,
  image_url text,
  vibe text,
  description text,
  rating numeric,
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.rooms enable row level security;

-- Anyone can view rooms
create policy "Anyone can view rooms" 
  on public.rooms for select 
  using ( true );

-- Only admins can insert/update/delete rooms
create policy "Admins can manage rooms" 
  on public.rooms for all 
  using ( 
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  with check (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
    or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );


-- 3. BOOKINGS TABLE
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  guest_id uuid references public.users(id) not null,
  room_id uuid references public.rooms(id) not null,
  check_in_date date not null,
  check_out_date date not null,
  total_price numeric not null,
  status text check (status in ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out')) default 'pending',
  payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bookings enable row level security;

-- Guests can view their own bookings
create policy "Guests can view own bookings" 
  on public.bookings for select 
  using ( auth.uid() = guest_id );

-- Guests can create bookings
create policy "Guests can insert own bookings" 
  on public.bookings for insert 
  with check ( auth.uid() = guest_id );

-- Admins can view and manage all bookings
create policy "Admins can manage all bookings" 
  on public.bookings for all 
  using ( 
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );


-- 4. REVIEWS TABLE
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) not null,
  guest_id uuid references public.users(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

-- Anyone can view reviews
create policy "Anyone can view reviews" 
  on public.reviews for select 
  using ( true );

-- Guests can insert reviews for their own bookings
create policy "Guests can insert own reviews" 
  on public.reviews for insert 
  with check ( auth.uid() = guest_id );

-- TRIGGERS

-- Trigger to automatically create a user profile when a new user signs up in Supabase Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'guest')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
