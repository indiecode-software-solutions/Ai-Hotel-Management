# Raj Heritage Hospitality: Project & Backend Study Guide

Welcome to the comprehensive documentation for the **Raj Heritage Hospitality** (AI-Hotel Management) project. This document is designed to help you understand the architecture, features, and backend structure of the application.

---

## 1. Project Overview
**Raj Heritage** is a premium hotel management system that merges luxury hospitality with advanced AI capabilities. It provides a seamless experience for both guests (booking and staying) and administrators (managing inventory and revenue).

### Core Objectives:
- **Premium UX**: High-end, cinematic design with dark-mode aesthetics.
- **AI-Driven Decisions**: Dynamic pricing suggestions based on real-time data.
- **Scalable Backend**: Built on Supabase for enterprise-grade security and speed.

---

## 2. Technical Stack

### Frontend (Client-Side)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (Ultra-fast development).
- **Styling**: Vanilla CSS with **Design Tokens** (Variables) for a consistent premium look.
- **Icons**: [Lucide React](https://lucide.dev/) for clean, modern iconography.
- **Charts**: [Recharts](https://recharts.org/) and [AmCharts](https://www.amcharts.com/) for data visualization.
- **Animations**: Subtle micro-interactions and transitions for a "WOW" factor.

### Backend (Server-Side & Database)
- **Platform**: [Supabase](https://supabase.com/) (PostgreSQL Database + Auth).
- **Authentication**: Secure login/signup with role-based access (Admin vs. Guest).
- **Storage**: For hotel images and guest avatars.
- **Realtime**: Instant updates for room availability and booking status.

### Integrations
- **Payments**: Razorpay Gateway for secure transactions.
- **AI Service**: Custom service layer for intelligent pricing and sentiment analysis.

---

## 3. Backend Deep Dive (Supabase)

The backend is organized into a relational database with strict security protocols.

### Database Schema (Tables)
| Table | Description | Key Fields |
| :--- | :--- | :--- |
| `users` | Extends Supabase Auth with custom profiles. | `id`, `role`, `full_name`, `avatar_url` |
| `rooms` | Hotel room inventory. | `type`, `base_price`, `capacity`, `status` |
| `bookings` | Customer reservations. | `guest_id`, `room_id`, `check_in_date`, `status` |
| `reviews` | Guest feedback and ratings. | `booking_id`, `rating`, `comment` |

### Security (RLS)
We use **Row Level Security (RLS)** to protect data:
- **Guests** can only read/edit their *own* bookings and profile.
- **Admins** have global access to manage all aspects of the hotel.
- **Public** can view room types and reviews but cannot modify them.

### Database Automation
- **SQL Triggers**: A trigger automatically creates an entry in the `public.users` table whenever a new user signs up via email/password, ensuring data consistency.

---

## 4. Frontend Architecture

The codebase follows a modular structure for easy maintenance and scalability.

### Folder Structure
- `src/components/ui/`: Reusable primitive components (Buttons, Cards, Inputs).
- `src/components/layout/`: Global layouts (Sidebar, Navbar, Dashboard wrappers).
- `src/pages/admin/`: Admin-only views (Pricing Engine, Room Inventory, Analytics).
- `src/pages/user/`: Guest-facing views (Landing Page, Booking Search, My Stays).
- `src/services/`: API communication layers (Supabase client, AI services).
- `src/styles/`: Global design tokens and theme configurations.

---

## 5. Key Features & Workflows

### 1. AI Pricing Engine
Located in `src/pages/admin/PricingEngine.jsx`, this feature analyzes current room occupancy and historical data to suggest optimal pricing adjustments to maximize revenue.

### 2. Smart Booking Flow
Guests can search for rooms using the `GuestSearch.jsx` interface. The system checks real-time availability in the `rooms` table, calculates the price, and handles the reservation via `bookingService.js`.

### 3. Admin Control Center
The dashboard (`Dashboard.jsx`) provides a bird's-eye view of the hotel's health, including total revenue, active bookings, and recent reviews.

---

## 6. How to Study the Code
1. **Start with `App.jsx`**: See how routes are defined for Admins and Guests.
2. **Explore `schema.sql`**: Understand the database relationships.
3. **Check `services/aiService.js`**: See how AI logic is integrated.
4. **Inspect `styles/theme.css`**: Learn how the design system is built using CSS variables.

---

*This document serves as a living guide for the Raj Heritage Hospitality project.*
