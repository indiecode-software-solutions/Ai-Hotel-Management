🚀 AI Hotel Management System — Frontend Build Prompt

🎯 Objective

Build a scalable, modular, premium-quality frontend for an AI-powered Hotel Management System.

The UI must reflect:
	•	Luxury hotel branding (dark + premium accent)
	•	Clean SaaS dashboard usability
	•	Scalable architecture for future features

⸻

🧠 CORE INSTRUCTIONS

You are building a production-grade frontend system, not a demo.

Follow these rules strictly:
	•	Use component-based architecture
	•	Use design tokens (CSS variables) for ALL styling
	•	Do NOT hardcode any colors
	•	Maintain clean separation of concerns
	•	Build for scalability and reuse

⸻

📁 CREATE PROJECT STRUCTURE

Create the following structure:
/src
  /components
    /ui
    /layout
  /features
    /booking
    /chatbot
    /pricing
    /reviews
    /admin
  /pages
  /services
  /hooks
  /utils
  /styles
    theme.css
    global.css
  App.jsx
  main.jsx


  🎨 DESIGN TOKENS (ADD THIS EXACTLY)

Create file: /src/styles/theme.css
:root {
  /* SURFACES */
  --surface-base: #0b0f1a;
  --surface-elevated: #121826;
  --surface-overlay: #1b2433;
  --surface-glass: rgba(255, 255, 255, 0.04);

  /* TEXT */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5f5;
  --text-muted: #94a3b8;
  --text-accent: #d4af37;

  /* ACTIONS */
  --action-primary: #0077b6;
  --action-primary-hover: #0096c7;
  --action-secondary: #00b4d8;
  --action-accent: #d4af37;

  /* BORDERS */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.12);

  /* EFFECTS */
  --shadow-soft: 0 8px 30px rgba(0, 0, 0, 0.35);
  --blur-glass: blur(14px);

  /* GRADIENTS */
  --gradient-primary: linear-gradient(135deg, #0077b6, #00b4d8);
  --gradient-accent: linear-gradient(135deg, #d4af37, #c6a85a);
  --gradient-overlay: linear-gradient(to bottom, rgba(11,15,26,0.5), rgba(11,15,26,0.95));
}



🌍 GLOBAL STYLES

Create: /src/styles/global.css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--surface-base);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
}

/* Glass Card */
.glass-card {
  background: var(--surface-glass);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-soft);
  border-radius: 12px;
}

/* Buttons */
.btn-primary {
  background: var(--gradient-primary);
  color: var(--text-primary);
  padding: 12px 20px;
  border-radius: 10px;
}

.btn-accent {
  border: 1px solid var(--action-accent);
  color: var(--action-accent);
  background: transparent;
}

⚙️ IMPORT STYLES

In main.jsx:
import './styles/theme.css';
import './styles/global.css';

🧩 CREATE CORE UI COMPONENTS

Inside /components/ui/, create:

Button.jsx
	•	Variants: primary, accent, ghost
	•	Uses design tokens only

Card.jsx
	•	Supports glass + solid variants

Input.jsx
	•	Clean minimal input with focus states

Badge.jsx
	•	Used for status (booking, AI, etc.)

⸻

🏗 CREATE LAYOUT SYSTEM

Inside /components/layout/:

Sidebar.jsx
	•	Fixed left navigation
	•	Dark surface
	•	Active item highlight

Navbar.jsx
	•	Top bar
	•	Includes user profile + notifications

DashboardLayout.jsx
	•	Combines sidebar + content area
	•	SPA layout (no reloads)

⸻

📄 CREATE INITIAL PAGES

Inside /pages/:
	•	Dashboard.jsx
	•	Bookings.jsx
	•	Guests.jsx
	•	Pricing.jsx
	•	Reviews.jsx

Each page:
	•	Uses DashboardLayout
	•	Uses reusable components

⸻

🤖 AI FEATURE UI PREPARATION

Chatbot
	•	Floating button (bottom right)
	•	Expandable chat window
	•	Message bubbles (user vs AI)

Pricing Suggestions
	•	Card showing:
	•	“Increase price by X%”
	•	Demand indicator

Review Analysis
	•	Sentiment badges
	•	Simple analytics cards

⸻

🎯 HERO SECTION (LANDING STYLE)

Create a full-width hero section:
	•	Background image
	•	Dark gradient overlay
	•	Left-aligned text
	•	Highlight words using accent token

Style:
	•	Cinematic
	•	Premium luxury feel
	•	Minimal UI clutter

⸻

⚡ DEVELOPMENT RULES
	•	No inline styles
	•	No hardcoded hex colors
	•	Always use tokens
	•	Keep components reusable
	•	Separate logic from UI

⸻

🚀 BUILD ORDER
	1.	Setup folder structure
	2.	Add theme.css + global.css
	3.	Create UI components
	4.	Build layout (Sidebar + Navbar)
	5.	Create Dashboard page
	6.	Add Hero section
	7.	Build Booking module first

⸻

🧠 FINAL INSTRUCTION

Think like:
	•	A SaaS product designer
	•	A luxury brand designer
	•	A scalable frontend architect

NOT like a beginner project.

Output clean, modular, production-ready code.